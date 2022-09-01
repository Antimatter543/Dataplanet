const URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

fetch(URL).then(res => res.json()).then(equakes => {
    // init spacing scale
    let x = 0.0000;

    // label fill colour
    function getLabelColour(d) {
        if (d.properties.mag >= 9) return "rgba(190, 15, 35, 0.75)";
        else if (d.properties.mag >= 8) return "rgba(248, 4, 4, 0.75)";
        else if (d.properties.mag >= 7) return "rgba(232, 103, 0, 0.75)";
        else if (d.properties.mag >= 6) return "rgba(250, 140, 59, 0.75)";
        else if (d.properties.mag >= 5) return "rgba(253, 193, 0, 0.75)";
        else if (d.properties.mag >= 4) return "rgba(255, 253, 6, 0.75)";
        else if (d.properties.mag >= 3) return "rgba(215, 245, 142, 0.75)";
        else if (d.properties.mag >= 2) return "rgba(150, 207, 86, 0.75)";
        else return "rgba(8, 170, 86, 0.75)";
    }

    // globe instance
    const myGlobe = Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .labelsData(equakes.features)
    .labelLat(d => d.geometry.coordinates[1])
    .labelLng(d => d.geometry.coordinates[0])
    .labelText(() => '')
    .labelAltitude(() => x += 0.0001)
    .labelSize(d => Math.sqrt(d.properties.mag))
    .labelDotRadius(d => Math.sqrt(d.properties.mag))
    .labelColor(d => getLabelColour(d))
    .labelResolution(3)
    (document.getElementById('globeViz'));

    // globe config
    myGlobe.controls().autoRotate = true;
    myGlobe.controls().autoRotateSpeed = 0.2;
    // myGlobe.controls().enableZoom = false;
});