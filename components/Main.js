import { useState, useCallback } from "react";
import { PollutionGlobe, EarthquakeGlobe, PovertyGlobe, SpeciesGlobe } from "./Globes";

export default function Main() {
    const [globe, setGlobe] = useState('pollution');

    const handleClick = useCallback((btnValue) => {
        setGlobe(btnValue);
    }, []);

    function getGlobe() {
        switch (globe) {
            case 'pollution':
                return <PollutionGlobe/>
            case 'earthquakes':
                return <EarthquakeGlobe/>
            case 'poverty':
                return <PovertyGlobe/>
            case 'species':
                return <SpeciesGlobe/>
        }
    }

    return (
        <>
        <NavBar onClick={handleClick}/>
        <Legend globe={globe}/>
        {getGlobe()}
        <Footer />
        </>
    );
}

function NavBar({onClick}) {
    return (
        <div className="btn-group">
            <NavBtn value="pollution" onClick={onClick}/>
            <NavBtn value="earthquakes" onClick={onClick}/>
            <NavBtn value="poverty" onClick={onClick}/>
            <NavBtn value="species" onClick={onClick}/>
        </div>
    );
}

function NavBtn({value, onClick}) {
    return (
        <button style={{width: "25%"}} onClick={() => onClick(value)}>
            {value.toUpperCase()} 
        </button>
    );
}

function Footer() {
    return (
        <div className="btn-group">
            <button style={{width: "50%"}} id="find-out-more">FIND OUT MORE</button>
            <button style={{width: "50%"}} id="how-you-can-help">HOW CAN YOU HELP</button>
        </div>
    );
}

function Legend({ globe }) {
    //temporary backwards compatability measures with old stylesheet
    const legendId = {
        pollution: 'poll',
        earthquakes: 'quake',
        poverty: 'pov',
        species: 'end'
    }
    const legendHeader = {
        pollution: <>PM2.5 (mg/m<sup>3</sup>)</>, //????
        earthquakes: 'Magnitude',
        poverty: 'GDP (USD$)',
        species: 'Endangered Species'
    }
    const legendData = {
        pollution: ['0-15', '15-30', '30-45', '45-60', '60+'],
        earthquakes: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        poverty: ['500+', '2,000+', '8,000+', '15,000+', '40,000+', '100,000+'],
        species: ['0-50', '50-100', '100-200', '200-500', '500-1000', '1000+', '1500+']
    }

    return (
    <div id="legend">
        <div id={`${legendId[globe]}-content`} className="legend-content">
            <div className="legend-header">
                <h2>{legendHeader[globe]}</h2>
            </div>
            <div id={`${legendId[globe]}-legend`} className="legend-body">
                {legendData[globe].reverse().map((data, index) => 
                    <div className={`deg-${index + 1}`}>
                        <div id={`box-${index + 1}`} className="colour-box"></div>
                        <p>{data}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}