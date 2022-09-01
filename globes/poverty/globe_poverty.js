//https://pip.worldbank.org/api

// GDP per capita (avoiding countries with small pop)
const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

// Globe initialisation

const world = Globe();

// Basically, you use the first fetch because that has polygon drawing data and then the second fetch is
// the data you wanna impleement.
// Fetch local json country stuff for polygons
fetch('../../data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{

    // Get poverty data
    fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')
    .then(res => res.json()).then(data => 
    {
        // Setting labels -- this is where we do poverty labelling.
        // d is the local countries data
        function setLabel(d) {
            let code = d.ISO_A3;

            if (code < 0)
                code = "";
            else
                code = `(${d.ISO_A3})`;

            let labelContent = `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'><b>Data for ${d.ADMIN} ${code} is not available.</b>`;

            // Add data (poverty)
            //// Let's add to labels:
            // poverty_line  country_code (ISO-A3), country_name, reporting_gdp, gini (lower is better)
            data.forEach(country => {
                // console.log(d.ISO_A3, country.country_code, country.country_name)
                if (country.country_code == d.ISO_A3 || country.country_name == d.SOVEREIGNT) {

                    labelContent = `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'><b>${country.country_name} (${d.ISO_A3}):
                    <br>
                    Reported GDP: ${country.reporting_gdp}
                    <br>
                    GINI (prefered low as possible): ${country.gini}
                    `;
                }
            })
            return labelContent;
        }

        // country fill colour
        function getFillColour(feat) {
            let value = 0;

            data.forEach(country => {
                if (country.country_code == feat.properties.ISO_A3 || country.country_name == feat.properties.SOVEREIGNT) {
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
        }

        // Globe settings
        world(document.getElementById('globeViz'))
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')) // tl;dr fuck antarctica 

        // Polygon looks
        .polygonAltitude(0.06)
        .polygonCapColor(feat => getFillColour(feat))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => setLabel(d))

        // Hover stuff
        .onPolygonHover(hoverD => world
        .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
        .polygonCapColor(d => d === hoverD ? 'steelblue' : getFillColour(d))
        )

            // globe config
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.2;
    // world.controls().enableZoom = false;
    });


});


    // live api stuff

// fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')
// .then(res => res.json())
// .then(t => console.log(t)) // think we just throw t into the fkin polgygonlayer.
