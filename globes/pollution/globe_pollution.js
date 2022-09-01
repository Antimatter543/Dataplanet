// myGlobe data set/geojson
const myGlobe = Globe()(document.getElementById('globeViz'))
.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
.backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');
// Country air pollution 
fetch('../../data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{
    // air exposure data set
    fetch('../../data/air/air_exposure.json').then(res => res.json()).then(data => 
    {
        // air pollution exposure value
        function getAQValue(d) {
            let code = d.ISO_A3;

            if (code < 0)
                code = "";
            else
                code = `(${d.ISO_A3})`;

            let content = `<div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'><b>Data for ${d.ADMIN} ${code} is not available.</b>`;

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

            if (value == 0 || value == null) return "#363636";
            else if (value >= 60) return "#F6412D";
            else if (value >= 45) return "#FF5607";
            else if (value >= 30) return "#FF9800";
            else if (value >= 15) return "#FFC100";
            else return "#FFEC19";
        }

        // globe instance
        myGlobe 
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
        .polygonsTransitionDuration(300);
        // globe config
        myGlobe.controls().autoRotate = true;
        myGlobe.controls().autoRotateSpeed = 0.2;
        // myGlobe.controls().enableZoom = false;
    });
});

// Hexbin OpenAQ air pollution
const options = {method: 'GET', headers: {Accept: 'application/json'}};

const weightColor = d3.scaleLinear()
.domain([0, 60])
.range(['yellow', 'darkred'])
.clamp(true);

fetch('https://api.openaq.org/v2/locations?limit=500&page=1&offset=0&sort=desc&radius=500&order_by=firstUpdated&dumpRaw=false', options)
  .then(response => response.json())
  .then(response => {
    // myGlobe settings
    // console.log(response.results.filter(d => d.coordinates !== null))
    myGlobe.hexBinPointsData(response.results.filter(d => d.coordinates !== null))  // don't put any null coordinates in the globe
    .hexBinPointLat(d => d.coordinates.latitude)
    .hexBinPointLng(d => d.coordinates.longitude)
    
    // Label aesthetics
    .hexLabel(d => d.name)
    .hexBinPointWeight(d => d.parameters[0].average)
    .hexAltitude(({sumWeight}) => setWeight(sumWeight))
    .hexTopColor(d => weightColor(d.sumWeight))
    .hexSideColor(d => weightColor(d.sumWeight))
    .hexLabel(d => setHexLabel(d))
    .hexBinResolution(3.5)
  });


// Sets max weight so hexagons can't just go BOOOOM.
function setWeight(d) {
    weight = d * 0.0070;
    // console.log(d, weight)
    maxWeight = 30*0.007
    if (weight >maxWeight) {return maxWeight};
    return weight;
}
// Set label for hex points.
function setHexLabel(d) {
    label = `The name for this is not available.`

    console.log(d.points[0].parameters)
    console.log(d)
    params = d.points[0].parameters
    label = `
    <div style='background: #343434; border: 1px solid #808080; padding: 0.5rem; border-radius: 0.5rem;'>
    <b>${d.points[0].name}.
    <br>
    Contains ${params[0].average} ${params[0].unit} of ${params[0].displayName}</b>`
    return label;
}

