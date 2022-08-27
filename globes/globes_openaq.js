fetch('/data/globe/simple_cities.json').then(res => res.json()).then(places => {
    Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .labelsData(places.features)
      .labelLat(d => d.properties.latitude)
      .labelLng(d => d.properties.longitude)
      .labelText(d => d.properties.name)
      .labelSize(d => Math.sqrt(d.properties.pop_max) * 4e-4)
      .labelDotRadius(d => Math.sqrt(d.properties.pop_max) * 4e-4)
      .labelColor(() => 'rgba(255, 165, 0, 0.75)')
      .labelResolution(2)
    (document.getElementById('globeViz'))
  });