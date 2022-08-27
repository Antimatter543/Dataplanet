//https://pip.worldbank.org/api

// GDP per capita (avoiding countries with small pop)
const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

// Globe initialisation

const world = Globe();

// Basically, you use the first fetch because that has polygon drawing data and then the second fetch is
// the data you wanna impleement.
// Fetch local json country stuff for polygons
fetch('/data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{

    // Get poverty data
    fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')
    .then(res => res.json()).then(data => 
    {

        // Setting labels -- this is where we do poverty labelling.
        function setLabel(d) {
            labelContent = `<b>${d.ADMIN} (${d.ISO_A3}):</b> <br />
            GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
            Population: <i>${d.POP_EST}</i>
            `
            // Add data (poverty)
            //// Let's add to labels:
            // poverty_line  country_code (ISO-A3), country_name, reporting_gdp, gini (lower is better)
            data.forEach(country => {
                if (country.country_code == d.ISO_A3) {
                    labelContent = `<b>${country.country_name} (${d.ISO_A3}):
                    <br>
                    GINI (lower is better): ${country.gini}
                    <br>
                    Reported GDP: ${country.reporting_gdp}
                    `;
                }
            })
            return labelContent;
        }

        // country fill colour
        function getFillColour(feat) {
            let value = 0;

            data.forEach(country => {
                if (country.country_code == feat.properties.ISO_A3) {
                    value = country.gini;
                }
            });

            if (value >= 0.5) return "#F6412D";
            else if (value >= 0.4) return "#FF5607";
            else if (value >= 0.3) return "#FF9800";
            else if (value >= 0.2) return "#FFC100";
            else return "#FFEC19";
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
    //     .polygonsTransitionDuration(300)
    //             .onPolygonHover(hoverD => world
    //     .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
    //     .polygonCapColor(d => d === hoverD ? 'steelblue' : getFillColour(d))
    // )
    // .polygonsTransitionDuration(300)
    });
});


    // live api stuff

fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')
.then(res => res.json())
.then(t => console.log(t)) // think we just throw t into the fkin polgygonlayer.
