const myGlobe = Globe()
.globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
.bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
.backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
(document.getElementById('globeViz'));

// from https://github.com/telegeography/www.submarinecablemap.com
fetch('//raw.githubusercontent.com/telegeography/www.submarinecablemap.com/master/web/public/api/v3/cable/cable-geo.json') // put this in firefox
.then(r =>r.json()) // convert to json
.then(cablesGeo => { // call it cablesGeo, 
  let cablePaths = [];
  cablesGeo.features.forEach(({ geometry, properties }) => {
	geometry.coordinates.forEach(coords => cablePaths.push({ coords, properties }));
  });

  myGlobe
	.pathsData(cablePaths)
	.pathPoints('coords')
	.pathPointLat(p => p[1])
	.pathPointLng(p => p[0])
	.pathColor(path => path.properties.color)
	.pathLabel(path => path.properties.name)
	.pathDashLength(0.1)
	.pathDashGap(0.008)
	.pathDashAnimateTime(12000);
});

// export {myGlobe};