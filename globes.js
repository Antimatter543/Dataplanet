
// Have one thing imported at a time -- chooses which globe to pick.


// import { myGlobe } from './globes/globe_test.js';
// import { myGlobe } from './globes/globe_cables_test.js';
// import { myGlobe } from './globes/globe_earthquake.js';


// let thing = fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(t => t.text);

// Other shit

// const weightColor = d3.scaleLinear()
// .domain([0, 60])
// .range(['lightblue', 'darkred'])
// .clamp(true);

const myGlobe = Globe()
.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
.ringLat(d => d.geometry.coordinates[1])
.ringLng(d => d.geometry.coordinates[0])
// .hexBinPointWeight(d => d.properties.mag)
// .hexAltitude(({ sumWeight }) => sumWeight * 0.0025)
// .hexTopColor(d => weightColor(d.sumWeight))
// .hexSideColor(d => weightColor(d.sumWeight))
// .hexLabel(d => `
//   <b>${d.points.length}</b> earthquakes in the past month:<ul><li>
//     ${d.points.slice().sort((a, b) => b.properties.mag - a.properties.mag).map(d => d.properties.title).join('</li><li>')}
//   </li></ul>
// `)
(document.getElementById('globeViz'));

// Obj.features is equakes. So looping through that is all the earthquake objects individually.

// Get data after making world
fetch('//earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson').then(res => res.json())
.then(obj => obj.features)
.then(equakes => myGlobe.ringsData(equakes)) // .then(equakes => console.log(equakes[0]))
