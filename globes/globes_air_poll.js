// world data set/geojson
const myGlobe = Globe();
fetch('/data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{
    // air exposure data set
    fetch('/data/air/air_exposure.json').then(res => res.json()).then(data => 
    {
        // air pollution exposure value
        function getAQValue(d) {
            let content = `<b>Data for ${d.ADMIN} (${d.ISO_A3}) is not available.</b>`;

            data.forEach(index => {
                if (index.CODE == d.ISO_A3)
                    content = `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'><b>${d.ADMIN} (${d.ISO_A3}):<br>Exposure to PM2.5: ${index.VALUE} mg/m<sup>3</sup></b></div>`;
            });

            return content;
        } 

        // country fill colour
        function getFillColour(feat) {
            let value = 0;

            data.forEach(index => {
                if (index.CODE == feat.properties.ISO_A3)
                    value = index.VALUE;
            });

            if (value >= 60) return "#F6412D";
            else if (value >= 45) return "#FF5607";
            else if (value >= 30) return "#FF9800";
            else if (value >= 15) return "#FFC100";
            else return "#FFEC19";
        }

        // globe instance
        myGlobe 
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')) // tl;dr fuck antarctica
        .polygonAltitude(0.06)
        .polygonCapColor(feat => getFillColour(feat))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => getAQValue(d))
        .onPolygonHover(hoverD => myGlobe
            .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
            .polygonCapColor(d => d === hoverD ? 'steelblue' : getFillColour(d))
        )
        .polygonsTransitionDuration(300)
        (document.getElementById('globeViz'));

        // globe config
        myGlobe.controls().autoRotate = true;
        myGlobe.controls().autoRotateSpeed = 0.2;
        myGlobe.controls().enableZoom = false;
    });
});

// export {world};
