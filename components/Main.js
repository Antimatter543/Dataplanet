import { useState, useCallback, useRef, useEffect } from "react";
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
        <Footer globe={globe}/>
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
        <button className="nav-btn" onClick={() => onClick(value)}>
            {value.toUpperCase()} 
        </button>
    );
}

function Footer({globe}) {
    const [visible, setVisible] = useState('none');
    function showModal() {
        if (visible === 'info' || visible === 'help') {
            return <Modal globe={globe} type={visible} closeModal={() => setVisible('none')}/>;
        }
    }

    return (
        <>
        <div className="btn-group" id="footer-group">
            <button id="find-out-more" onClick={() => setVisible('info')}>FIND OUT MORE</button>
            <button id="how-you-can-help" onClick={() => setVisible('help')}>HOW CAN YOU HELP</button>
        </div>
        {showModal()}
        </>
    );
}

function Legend({globe}) {
    //temporary backwards compatability measures with old stylesheet
    const legendId = {
        pollution: 'poll',
        earthquakes: 'quake',
        poverty: 'pov',
        species: 'end'
    }
    const legendHeader = {
        pollution: <>PM2.5 (mg/m<sup>3</sup>)</>,
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
                    <div key={index} className={`deg-${index + 1}`}>
                        <div id={`box-${index + 1}`} className="colour-box"></div>
                        <p>{data}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}

//for detecting if area outside modal clicked
function useOutsideAlerter(ref, fn) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          fn();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
}

function Modal({globe, type, closeModal}) {
    //for detecting if area outside modal clicked
    const ref = useRef(null);
    useOutsideAlerter(ref, closeModal);

    //css backwards compatability
    const info = {
        pollution: (
        <>
        <p>(data in globe extracted from <a href="https://aws.amazon.com/marketplace/pp/prodview-rvesvhymasphs?sr=0-1&ref_=beagle&applicationId=AWSMPContessa" target="_blank">OpenAQ</a> and the <a href="https://data.oecd.org/air/air-pollution-exposure.htm" target="_blank">OECD</a>)</p>
        <p><strong>Air pollution</strong> affects humans short-term, causing pneumonia, bronchitis and irritation. Furthermore, air pollution can cause long-term effects on humans such as heart disease, lung cancer and respiratory diseases.</p>
        <p>Environmental effects due to air pollution consist of the contamination of water and soil, which kill crops and reduce yield. Air pollution can also cause acid rain, degrading water quality and damaging buildings. Animals are also susceptible to birth defects and lower reproductive rates due to air pollution.</p>
        <p>Click <a href="https://education.nationalgeographic.org/resource/air-pollution" target="_blank">here</a> for our source and more information on air pollution.</p>
        </>),
        earthquakes: (
        <>
        <p>(data in globe extracted from the <a href="https://data.un.org/" target="_blank">United States Geological Survey</a> from the past 30 days).</p>
        <p>Some facts about <strong>earthquakes</strong> that many people aren't aware about:</p>
        <ul>
            <li>Approximately 20,000 people die per year from earthquakes</li>
            <li>Between 1998 and 2017, approximately 125 million people were affected by earthquakes, meaning they were &nbsp;&nbsp;injured, went into poverty, or displaced/evactuated</li>
            <li>Earthquakes are one of the more lethal and damaging natural disasters</li>
        </ul>
        <p>Click <a href="https://www.who.int/health-topics/earthquakes#tab=tab_1" target="_blank">here</a> for our source and more information about earthquakes.</p>
        </>),
        poverty: (
        <>
        <p>(data in globe extracted from the <a href="https://pip.worldbank.org/home" target="_blank">World bank</a>)</p>
        <p style={{fontSize: "16px"}}>There are several reasons for which people live in <strong>poverty</strong>, which include, but not limited to:</p>
        <ul>
            <li>Being born into poverty</li>
            <li>Suffering domestic abuse, forcing the person to flee home</li>
            <li>Losing employment due to COVID-19</li>
            <li>Losing homes due to natural disasters</li>
        </ul>
        <p></p>
        <p style={{fontSize: "16px"}}>Poverty can severely impact people's lives, some of the effects include:</p>
        <ul>
            <li>Greatly increased levels of stress, which can lead to health problems</li>
            <li>People in poverty are more likely to turn to crime to provide for their family</li>
            <li>Children living in poverty are more susceptible to health problems</li>
            <li>Children living in poverty also have less opportunities for an education</li>
        </ul>
        <p>Click <a href="https://www.dumgal.gov.uk/media/23593/Factsheet-Causes-and-Effects-of-Poverty/pdf/0125-20_Causes_and_Effects_of_poverty.pdf?m=637775983227400000" target="_blank">here</a> for our source and more information on poverty.</p>
        </>),
        species: (
        <>
        <p>(data in globe extracted from the <a href="https://data.un.org/" target="_blank">UN</a>)</p>
        <p><strong>Endangered species</strong> are becoming more and more common as the years go by.</p>
        <p>Some of the causes of the continual increase of endangered species are:</p>
        <ul>
            <li><strong>Habitat loss</strong> - This can be due to natural disasters or deforestation</li>
            <li><strong>Human exploitation</strong> - Humans often selfishly use rare animals or plants for exploitation or to make money</li>
            <li><strong>Displacement</strong> - Habitat loss can cause a species to displace somewhere safe, but may not be able to adapt</li>
        </ul>
        <p>With more endangered species, biodiversity decreases, but why should we care about the decrease of biodiversity? Some of the effects of this decrease include:</p>
        <ul>
            <li><strong>Disruption to the food chain</strong> - Animals that ate a newly-extinct species must find a new source of food</li>
            <li><strong>Disruption to our economy</strong> - We rely on certain endangered species in our economy, this includes honey bees</li>
            <li><strong>Less resources for humanity</strong> - People rely on certain species for food, clothing, or for their job, hence &nbsp;&nbsp;it is a problem if these species go extinct</li>
        </ul>
        <p>Click <a href="https://environment.co/the-effects-of-endangered-species/" target="_bank">here</a> for our source and more information on endangered species.</p>
        </>),
    }
    const help = {
        pollution: (
        <>
        <p style={{fontSize: "larger"}}><strong>Ways you can help</strong></p>
        <ul>
            <li> Riding a bicycle or walking instead of using motorized transport
                <ul>
                    <li>Using public transport instead of a personal vehicle</li>
                    <li>Recycling yard trimmings instead of burning them</li>
                    <li>Donate or participate in charities focused on clearing the air, such as <a href="https://www.cleanairfund.org/" target="_blank">https://www.cleanairfund.org/</a></li>
                </ul>
            </li>
        </ul>
        <p></p>
        </>),
        earthquakes: (
        <>
        <p>The best way you can help victims of earthquakes is to donate to charity. Click <a href="https://www.directrelief.org/emergency/earthquakes/" target="_blank">here</a> to donate to a reputable charity concerning earthquake relief.</p>
        </>),
        poverty: (
        <>
        <p>The best way to help those suffering in poverty is to donate to charity. Click <a href="https://impactful.ninja/best-charities-for-global-poverty/" target="_blank">here</a> to see the top 20 charities to support those living in poverty. </p>
        </>),
        species: (
        <>
        <p>There are many ways you can support the many endangered species on our planet:</p>
        <ul>
            <li><strong>Reduce, reuse and recycle</strong> - preventing misplaced rubbish can help all life, especially marine life</li>
            <li><strong>Don't purchase items like turtle and tortoise shells, ivory, coral</strong> - the sale of these items contributes &nbsp;&nbsp;to the endangering of certain species</li>
            <li><strong>Spread the word</strong> - use your voice to speak up for the animals who cannot speak for themselves</li>
            <li><strong>Drive carefully</strong> - it is important to stay alert while driving to prevent hitting a potentially endangered &nbsp;&nbsp;animal, such as koalas</li>
            <li><strong>Donate to charity</strong> - donating charity can assist the protection of endangered species. Click <a href="https://www.worldwildlife.org/" target="_blank">here</a> for a &nbsp;&nbsp;reputable charity</li>
        </ul>
        <p></p>
        </>),
    }
    const header = {
        info: 'INFORMATION',
        help: 'HOW YOU CAN HELP '
    }

    return (
    <div id={`${type}-modal`} className="modal">
        <div className="modal-content" ref={ref}>
            <div className="modal-header">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>{globe === 'species' && 'ENDANGERED '}{`${globe.toUpperCase()} | ${header[type]}`}</h2>
            </div>
            <div className="modal-body">
                {type === 'help' ? help[globe] : info[globe]}
            </div>
        </div>
    </div>
    );
}