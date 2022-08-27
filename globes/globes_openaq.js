const world = Globe()(document.getElementById('globeViz'))
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');
const options = {method: 'GET', headers: {Accept: 'application/json'}};

const weightColor = d3.scaleLinear()
.domain([0, 60])
.range(['yellow', 'darkred'])
.clamp(true);

fetch('https://api.openaq.org/v2/locations?limit=200&page=1&offset=0&sort=desc&radius=100&order_by=lastUpdated&dumpRaw=false', options)
  .then(response => response.json())
  .then(response => {
    world.hexBinPointsData(response.results)
    .hexBinPointLat(d => d.coordinates.latitude)
    .hexBinPointLng(d => d.coordinates.longitude)
    
    // Label aesthetics
    .hexLabel(d => d.name)
    .hexBinPointWeight(d => d.parameters[0].average)
    .hexAltitude(({ sumWeight }) => sumWeight * 0.0070)
    .hexTopColor(d => weightColor(d.sumWeight))
    .hexSideColor(d => weightColor(d.sumWeight))
    .hexLabel(d => setLabel(d))
  });

// World settings
world

// Set label for hex points.
function setLabel(d) {
    label = `The name for this is not available.`

    console.log(d.points[0].parameters)
    console.log(d)
    params = d.points[0].parameters
    label = `${d.points[0].name}.
    <br>
    Contains ${params[0].average} ${params[0].unit} of ${params[0].displayName}`
    return label;
}
// .labelSize(d => Math.sqrt(d.parameters[0].average))
// .labelDotRadius(d => Math.sqrt(d.parameters[0].average) *0.3)


// fetch('/data/globe/simple_cities.json').then(res => res.json()).then(places => {
//     Globe()
//       .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
//       .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
//       .labelsData(places.features)
//       .labelLat(d => d.properties.latitude)
//       .labelLng(d => d.properties.longitude)
//       .labelText(d => d.properties.name)
//       .labelSize(d => Math.sqrt(d.properties.pop_max) * 4e-4)
//       .labelDotRadius(d => Math.sqrt(d.properties.pop_max) * 4e-4)
//       .labelColor(() => 'rgba(255, 165, 0, 0.75)')
//       .labelResolution(2)
//     (document.getElementById('globeViz'))
//   });