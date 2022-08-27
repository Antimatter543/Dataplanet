const world = Globe()(document.getElementById('globeViz'))
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');
const options = {method: 'GET', headers: {Accept: 'application/json'}};

fetch('https://api.openaq.org/v2/locations?limit=100&page=1&offset=0&sort=desc&radius=1000&order_by=lastUpdated&dumpRaw=false', options)
  .then(response => response.json())
  .then(response => {
    world.labelsData(response.results)
  });

// World settings
world.labelLat(d => d.coordinates.latitude)
.labelLng(d => d.coordinates.longitude)
.labelText(d => d.name)
.labelSize(d => Math.sqrt(d.parameters[0].average) *0.3)
.labelDotRadius(d => Math.sqrt(d.parameters[0].average) *0.3)


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