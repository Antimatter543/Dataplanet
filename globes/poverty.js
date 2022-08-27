fetch('/data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
    {
      const world = Globe()
      (document.getElementById('globeViz'))

        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonColor(() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`)
        .hexPolygonLabel(({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${d.POP_EST}</i>
        `)
        (document.getElementById('globeViz'))
    });    fetch('/data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
    {
      const world = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .hexPolygonsData(countries.features) // features contains type, properties, bbox, geometry
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonColor(() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`)
        .hexPolygonLabel(({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${d.POP_EST}</i>
        `)
    });



    // live api stuff
fetch('https://api.worldbank.org/pip/v1/pip?country=all&year=2018&povline=1.9&fill_gaps=false')
.then(res => res.json())
.then(t => console.log(t[0])) // think we just throw t into the fkin polgygonlayer.

// .then(t => console.log(t[0].region_name))