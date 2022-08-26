
// Have one thing imported at a time -- chooses which globe to pick.


import { myGlobe } from './globes/globe_test.js';
// import { myGlobe } from './globes/globe_cables_test.js';
// import { myGlobe } from './globes/globe_earthquake.js';


let thing = fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(t => t.text);

console.log(thing);