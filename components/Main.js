import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { csv } from 'd3';

//wrapper and forward ref allows globe gl to work with nextjs
const GlobeTmpl = dynamic(() => import("../components/Globe.js"), {
    ssr: false,
  });
const Globe = forwardRef((props, ref) => (
    <GlobeTmpl {...props} forwardRef={ref} />
));

//funcs that load & process required data
const globeData = {
    earthquakes: function(setData) { //setData is callback to setData in Globe component
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson')
            .then(res => res.json())
            .then(res => setData(res.features))
    },
    endangered: function(setData) {
        csv('./data/endangered.csv', (d) => {
            return {
                Country: d.Country,
                Year: +d.Year,
                Value: +d.Value
            };
        })
        .then(res => setData(res))
    },
    countries: function(setGeoData) {
        fetch('./data/ne_110m_admin_0_countries.geojson')
        .then(res => res.json())
        .then(res => setGeoData(res.features))
    }
}
//funcs that determine globe colours based on data
const globeColour = {
    earthquakes: function(d) {
        if (d.properties.mag >= 9) return "rgba(190, 15, 35, 0.75)";
        else if (d.properties.mag >= 8) return "rgba(248, 4, 4, 0.75)";
        else if (d.properties.mag >= 7) return "rgba(232, 103, 0, 0.75)";
        else if (d.properties.mag >= 6) return "rgba(250, 140, 59, 0.75)";
        else if (d.properties.mag >= 5) return "rgba(253, 193, 0, 0.75)";
        else if (d.properties.mag >= 4) return "rgba(255, 253, 6, 0.75)";
        else if (d.properties.mag >= 3) return "rgba(215, 245, 142, 0.75)";
        else if (d.properties.mag >= 2) return "rgba(150, 207, 86, 0.75)";
        else return "rgba(8, 170, 86, 0.75)";
    },
    endangered: function(d, data) {
        let value = 0;

        data.forEach(index => {
            if (index.Country == d.properties.ADMIN)
                value = index.Value;
        });

        if (value == 0 || value == null) return "#363636";
        else if (value >= 1500) return "#2b463b";
        else if (value >= 1000) return "#345447";
        else if (value >= 500) return "#447358";
        else if (value >= 200) return "#838B50";
        else if (value >= 100) return "#A3B86A";
        else if (value >= 50) return "#abef7f";
        else return "#90EE90";
    },
}
//static config
const globeConfig = {
    earthquakes: { //dots in equake locations with colour indicating magnitude
        labelLat: (d => d.geometry.coordinates[1]),
        labelLng: (d => d.geometry.coordinates[0]),
        labelText: (() => ''),
        labelAltitude: 0, //fix later
        labelSize: (d => Math.sqrt(d.properties.mag)),
        labelDotRadius: (d => Math.sqrt(d.properties.mag)),
        labelColor: (d => globeColour[globeType](d)),
        labelResolution: 3
    },
    endangered: {
        lineHoverPrecision: 0,
        polygonSideColor: (() => 'rgba(0, 100, 0, 0.15)'),
        polygonStrokeColor: (() => '#111'),
        polygonsTransitionDuration: 300
    }
}

function World({globeType}) {
    const globeRef = useRef(); //allows globe animations in nextjs
    const [globeReady, setGlobeReady] = useState(false);
    const [data, setData] = useState([]);
    const [geoData, setGeoData] = useState([]);
    const [hoverD, setHoverD] = useState();

    //config that relies on state vars
    const globeConfig2 = {
        earthquakes: {
            labelsData: data
        },
        endangered: {
            //excluding AQ required for data to render somehow
            polygonsData: (geoData.filter(d => d.properties.ISO_A2 !== 'AQ')),
            polygonAltitude: (d => d === hoverD ? 0.12 : 0.06),
            polygonCapColor: (d => d === hoverD ? 'steelblue' : globeColour[globeType](d, data)),
            onPolygonHover: setHoverD,
            polygonLabel: (({ properties: d }) => {
                //matches country location to no. of endangered species
                let code = d.ISO_A3;
    
                if (code < 0)
                    code = "";
                else
                    code = `(${d.ISO_A3})`;
                    
                //creates html label
                let content = `Data for ${d.ADMIN} ${code} is not available.`;
                data.forEach(index => {
                    if (index.Country == d.ADMIN && index.Year == 2021)
                        content = `${d.ADMIN} (${d.ISO_A3}):<br>Number of endangered species: ${index.Value}`;
                });
                return `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'><b>${content}</b></div>`;
            })
        }
    }
    
    //load data
    useEffect(() => {
        globeData.countries(setGeoData);
        globeData[globeType](setData);
    }, [globeReady]);

    //globe spinning animations
    useEffect(() => {
        if (!globeRef.current) return;
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.2;
    }, [globeReady])

    return <Globe 
        ref={globeRef}
        globeImageUrl='//unpkg.com/three-globe/example/img/earth-night.jpg'
        backgroundImageUrl='//unpkg.com/three-globe/example/img/night-sky.png'
        onGlobeReady={() => setGlobeReady(true)}
        {...globeConfig[globeType]}
        {...globeConfig2[globeType]}
    />
}

export default function Main() {
    return (
        <>
        <World globeType='endangered'/>
        </>
    );
}