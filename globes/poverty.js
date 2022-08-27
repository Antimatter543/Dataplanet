    const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

    // GDP per capita (avoiding countries with small pop)
    const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);


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

                // Add data (poverty) specific stuff
                //// Let's add to labels:
                // poverty_line 
                // country_code (ISO-A3), country_name, reporting_gdp, gini (lower is better)
                data.forEach(country => {
                    if (country.country_code == d.ISO_A3) {
                        labelContent = `<b>${country.country_name} (${d.ISO_A3}):
                        <br>
                        GINI (lower is better): ${country.gini}
                        <br>
                        Reported GDP: ${country.reporting_gdp}
                        `
                        // Exposure to PM2.5: ${index.VALUE} mg/m<sup>3</sup></b>`;

                    }
                })
                return labelContent;
            }

            // Globe initialisation
            const world = Globe()(document.getElementById('globeViz'))
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .lineHoverPrecision(0)
            .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')) // tl;dr fuck antarctica 

            // Polygon looks
            .polygonAltitude(0.06)
            .polygonCapColor(feat => colorScale(getVal(feat)))
            .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
            .polygonStrokeColor(() => '#111')
            .polygonLabel(({ properties: d }) => setLabel(d))

            // Hover stuff
            .onPolygonHover(hoverD => world
            .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
            .polygonCapColor(d => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
            )
            .polygonsTransitionDuration(300)
        });
    });


    // live api stuff
//https://pip.worldbank.org/api
    /// ISO-3 region codes!

// fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')

// Will try the pip-grp thing because it has easier to read summary data
fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')
.then(res => res.json())
.then(t => console.log(t)) // think we just throw t into the fkin polgygonlayer.


//reporting_pop, poverty_severity (as colour?), pop_in_poverty (these are the number of people BELOW poverty_line/day (i.e $1.9 usually)),
// .then(t => console.log(t[0].region_name))