// world data set/geojson
const myGlobe = Globe();
fetch('../../data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{
    //helper func to convert to correct datatype
    function type(d) {
        return {
            Country: d.Country,
            Year: +d.Year,
            Value: +d.Value
        }
    }

    // threatened species data set
    d3.csv('../../data/endangered/endangered.csv', type)
    .then(data =>
    {
        //number of endangered species in 2021
        function getThreatValue(d) {
            let code = d.ISO_A3;

            if (code < 0)
                code = "";
            else
                code = `(${d.ISO_A3})`;
                
            let content = `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'><b>Data for ${d.ADMIN} ${code} is not available.</b>`;

            data.forEach(index => {
                if (index.Country == d.ADMIN && index.Year == 2021)
                    content = `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'><b>${d.ADMIN} (${d.ISO_A3}):<br>Number of endangered species: ${index.Value}</b>`;
            });
            return content
        }

        // country fill colour
        function getFillColour(feat) {
            let value = 0;

            data.forEach(index => {
                if (index.Country == feat.properties.ADMIN)
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
        }

        // globe instance
        myGlobe
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonAltitude(0.06)
        .polygonCapColor(feat => getFillColour(feat))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => getThreatValue(d))
        .onPolygonHover(hoverD => myGlobe
            .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
            .polygonCapColor(d => d === hoverD ? 'steelblue' : getFillColour(d))
        )
        .polygonsTransitionDuration(300)
        (document.getElementById('globeViz'));

        // globe config
        myGlobe.controls().autoRotate = true;
        myGlobe.controls().autoRotateSpeed = 0.2;
        // myGlobe.controls().enableZoom = false;
    });
});

// export {world};
