import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { csv, scaleLinear } from 'd3';

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
        .then(setData)
    },
    countries: function(setGeoData) {
        fetch('./data/ne_110m_admin_0_countries.geojson')
        .then(res => res.json())
        .then(res => setGeoData(res.features))
    },
    poverty: function(setData) {
        fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')
        .then(res => res.json())
        .then(setData)
    },
    pollution: function(setData) {
        //air pollution by country
        fetch('./data/air_exposure.json')
        .then(res => res.json())
        .then(setData);
    },
    pollutionHex: function(setHexBinData) {
        //Hexbin OpenAQ air pollution
        const options = {method: 'GET', headers: {Accept: 'application/json'}};
        fetch('https://api.openaq.org/v2/locations?limit=500&page=1&offset=0&sort=desc&radius=500&order_by=firstUpdated&dumpRaw=false', options)
        .then(res => res.json())
        .then(res => res.results)
        .then(setHexBinData)
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

        if (value == 0 || value == null) return "#363636"; //no data
        else if (value >= 1500) return "#2b463b";
        else if (value >= 1000) return "#345447";
        else if (value >= 500) return "#447358";
        else if (value >= 200) return "#838B50";
        else if (value >= 100) return "#A3B86A";
        else if (value >= 50) return "#abef7f";
        else return "#90EE90";
    },
    poverty: function(d, data) {
        let value = 0;

        data.forEach(country => {
            if (country.country_code == d.properties.ISO_A3 || country.country_name == d.properties.SOVEREIGNT) {
                value = country.reporting_gdp;
            }
        });

        if (value == 0) return "#363636"; // This means no data was found
        else if (value <= 500) return "#F6412D";
        else if (value <= 2000) return "#FF5607";
        else if (value <= 8000) return "#FF9800";
        else if (value <= 15000) return "#FFC100";
        else if (value <= 40000) return '#39e75f';
        else if (value <= 100000) return "#00FF00"
        else return "#FFFFFF";
    },
    pollution: function(d, data) {
        let value = 0;

        data.forEach(index => {
            if (index.CODE == d.properties.ISO_A3)
                value = index.VALUE;
        });

        if (value == 0 || value == null) return "#363636"; //no data
        else if (value >= 60) return "#F6412D";
        else if (value >= 45) return "#FF5607";
        else if (value >= 30) return "#FF9800";
        else if (value >= 15) return "#FFC100";
        else return "#FFEC19";
    },
}

// Sets max weight so hexagons can't just go BOOOOM.
function setWeight(d) {
    const weight = d * 0.0070;
    // console.log(d, weight)
    const maxWeight = 30*0.007
    return (weight > maxWeight) ? maxWeight : weight;
}
// Set label for hex points.
const weightColour = scaleLinear()
.domain([0, 60])
.range(['yellow', 'darkred'])
.clamp(true);


//html template for labels
const labelTempl = `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'>`;
//funcs that fill label content based on data
const globeLabels = {
    endangered: function(d, data) {
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
        return `${labelTempl}<b>${content}</b>`;
    },
    poverty: function(d, data) {
        let code = d.ISO_A3;

        if (code < 0)
            code = "";
        else
            code = `(${d.ISO_A3})`;

        let labelContent = `Data for ${d.ADMIN} ${code} is not available.`;

        // Add data (poverty)
        //// Let's add to labels:
        // poverty_line  country_code (ISO-A3), country_name, reporting_gdp, gini (lower is better)
        data.forEach(country => {
            // console.log(d.ISO_A3, country.country_code, country.country_name)
            if (country.country_code == d.ISO_A3 || country.country_name == d.SOVEREIGNT) {

                labelContent = `${country.country_name} (${d.ISO_A3}):
                    <br>
                    Reported GDP: ${country.reporting_gdp}
                    <br>
                    GINI (prefered low as possible): ${country.gini}`;
            }
        })
        return `${labelTempl}<b>${labelContent}</b>`;
    },
    pollution: function(d, data) {
        let code = d.ISO_A3;

        if (code < 0)
            code = "";
        else
            code = `(${d.ISO_A3})`;

        let content = `Data for ${d.ADMIN} ${code} is not available.`;

        data.forEach(index => {
            if (index.CODE == d.ISO_A3)
                content = `${d.ADMIN} (${d.ISO_A3}):<br>Exposure to PM2.5: ${index.VALUE} mg/m<sup>3</sup>`;
        });
        return `${labelTempl}<b>${content}</b>`;
    },
    pollutionHex: function(d) {
        params = d.points[0].parameters
        label = `
        ${labelTempl}
        <b>${d.points[0].name}.
        <br>
        Contains ${params[0].average} ${params[0].unit} of ${params[0].displayName}</b>`
        return label;
    }
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
    },
    poverty: {
        lineHoverPrecision: 0,
        polygonSideColor: (() => 'rgba(0, 100, 0, 0.15)'),
        polygonStrokeColor: (() => '#111'),
        polygonsTransitionDuration: 300
    },
    pollution: {
        //country landmasses
        lineHoverPrecision: 0,
        polygonSideColor: (() => 'rgba(0, 100, 0, 0.15)'),
        polygonStrokeColor: (() => '#111'),
        polygonsTransitionDuration: 300,
        //hex bins
        hexBinPointLat: (d => d.coordinates.latitude),
        hexBinPointLng: (d => d.coordinates.longitude),
        hexLabel: (d => d.name),
        hexBinPointWeight: (d => d.parameters[0].average),
        hexAltitude: (({sumWeight}) => setWeight(sumWeight)),
        hexTopColor: (d => weightColour(d.sumWeight)),
        hexSideColor: (d => weightColour(d.sumWeight)),
        hexBinResolution: 3.5
    },
}

function World({globeType}) {
    const globeRef = useRef(); //allows globe animations in nextjs
    const [globeReady, setGlobeReady] = useState(false);
    const [data, setData] = useState([]);
    const [geoData, setGeoData] = useState([]);
    const [hoverD, setHoverD] = useState();
    const [hexBinData, setHexBinData] = useState([]);

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
            polygonLabel: (({ properties: d }) => globeLabels[globeType](d, data))
        },
        poverty: {
            polygonsData: (geoData.filter(d => d.properties.ISO_A2 !== 'AQ')), // tl;dr fuck antarctica 
            polygonAltitude: (d => d === hoverD ? 0.12 : 0.06),
            polygonCapColor: (d => d === hoverD ? 'steelblue' : globeColour[globeType](d, data)),
            onPolygonHover: setHoverD,
            polygonLabel: (({ properties: d }) => globeLabels[globeType](d, data))
        },
        pollution: {
            polygonsData: (geoData.filter(d => d.properties.ISO_A2 !== 'AQ')),
            polygonAltitude: (d => d === hoverD ? 0.12 : 0.06),
            polygonCapColor: (d => d === hoverD ? 'steelblue' : globeColour[globeType](d, data)),
            onPolygonHover: setHoverD,
            polygonLabel: (({ properties: d }) => globeLabels[globeType](d, data)),
            hexBinPointsData: (hexBinData.filter(d => d.coordinates !== null)), //exclude null coords
            hexLabel: (d => globeLabels.pollutionHex(d))
        },
    }
    
    //load data
    useEffect(() => {
        globeData.countries(setGeoData);
        globeData[globeType](setData);
        //if (globeType === 'pollution')
        globeData.pollutionHex(setHexBinData);
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
        //onGlobeReady={() => setGlobeReady(true)}
        onGlobeReady={() => {setGlobeReady(true); console.log(hexBinData)}}
        {...globeConfig[globeType]}
        {...globeConfig2[globeType]}
    />
}

export default function Main() {
    return (
        <>
        <World globeType='pollution'/>
        </>
    );
}