// world data set/geojson
const world = Globe();
fetch('./data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{
    // air exposure data set
    fetch('./data/air/air_exposure.json').then(res => res.json()).then(data => 
    {
        // air pollution exposure value
        function getAQValue(d) {
            let content = `<b>DATA FOR ${d.ADMIN} (${d.ISO_A3}) IS NOT AVAILABLE.</b>`;

            data.forEach(index => {
                if (index.CODE == d.ISO_A3)
                    content = `<b>${d.ADMIN} (${d.ISO_A3}):<br>Exposure to PM2.5: ${index.VALUE} mg/m<sup>3</sup></b>`;
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
        world
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonAltitude(0.06)
        .polygonCapColor(feat => getFillColour(feat))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => getAQValue(d))
        .onPolygonHover(hoverD => world
            .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
            .polygonCapColor(d => d === hoverD ? 'steelblue' : getFillColour(d))
        )
        .polygonsTransitionDuration(300)
        (document.getElementById('globeViz'));

        // globe config
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.6;
    });
});

export {world};
