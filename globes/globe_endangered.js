// year selector
var year = 2021;

// world data set/geojson
const myGlobe = Globe();

function loadGlobe() {
fetch('/data/globe/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{
    //helper func to convert to correct datatype
    function type(d) {
        return {
            Country: d.Country,
            Year: +d.Year,
            Value: +d.Value
        }
    }

    // threatened species data set
    d3.csv('/data/endangered/endangered.csv', type)
    .then(data =>
    {
        //number of endangered species in 2021
        function getThreatValue(d) {
            let content = `<b>DATA FOR ${d.ADMIN} (${d.ISO_A3}) IS NOT AVAILABLE.</b>`;

            data.forEach(index => {
                if (index.Country == d.ADMIN && index.Year == year)
                    content = `<b>${d.ADMIN} (${d.ISO_A3}):<br>Number of endangered species: ${index.Value}</b>`;
            });
            return content
        }

        // country fill colour
        function getFillColour(feat) {
            let value = 0;

            data.forEach(index => {
                if (index.Country == feat.properties.ADMIN)
                    value = index.Value;
            });


            if (value >= 1500) return "#F6412D";
            else if (value >= 1000) return "#FF5607";
            else if (value >= 500) return "#FF9800";
            else if (value >= 200) return "#FF7f07";
            else if (value >= 100) return "#FFad00";
            else if (value >= 50) return "#FFC100";
            else return "#FFEC19";
        }

        // globe instance
        myGlobe
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonAltitude(0.06)
        .polygonCapColor(feat => getFillColour(feat))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => getThreatValue(d))
        .onPolygonHover(hoverD => myGlobe
            .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
            .polygonCapColor(d => d === hoverD ? 'steelblue' : getFillColour(d))
        )
        .polygonsTransitionDuration(300)
        (document.getElementById('globeViz'));

        // globe config
        myGlobe.controls().autoRotate = true;
        myGlobe.controls().autoRotateSpeed = 0.2;
        myGlobe.controls().enableZoom = false;
    });
});
}
loadGlobe();

function deactivateAll() {
    let yearBtns = document.querySelectorAll(".time-btns button");
    for(let [i, btn] of yearBtns.entries()) {
        btn.classList.remove("active")
    }
}

document.querySelector("#year-2021").addEventListener("click", function(event) {
    year = 2021;
    loadGlobe();
    deactivateAll();
    this.classList.add("active");
})
document.querySelector("#year-2020").addEventListener("click", function(event) {
    year = 2020;
    loadGlobe();
    deactivateAll();
    this.classList.add("active");
})
document.querySelector("#year-2019").addEventListener("click", function(event) {
    year = 2019;
    loadGlobe();
    deactivateAll();
    this.classList.add("active");
})
document.querySelector("#year-2018").addEventListener("click", function(event) {
    year = 2018;
    loadGlobe();
    deactivateAll();
    this.classList.add("active");
})
document.querySelector("#year-2015").addEventListener("click", function(event) {
    year = 2015;
    loadGlobe();
    deactivateAll();
    this.classList.add("active");
})
document.querySelector("#year-2010").addEventListener("click", function(event) {
    year = 2010;
    loadGlobe();
    deactivateAll();
    this.classList.add("active");
})
document.querySelector("#year-2004").addEventListener("click", function(event) {
    year = 2004;
    loadGlobe();
    deactivateAll();
    this.classList.add("active");
})

// export {world};
