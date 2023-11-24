import Stars from '../components/Stars.js'

export default function Intro({ onClick }) {
    const prefix = process.env.NODE_ENV === 'development' ? "" : "/Dataplanet"

    return (
    <>
        <div className="titlediv">
            <h1 className="title">Data Planet</h1>
            <p className="place">Visualise our planet through the problems it faces.</p>
            <div className="click">
                <p className="begin"><i>click the world to begin</i></p>
            </div>
            <button className="btn" onClick={onClick}>
                {/** remove /Dataplanet prefix for local dev */}
                <img src={`${prefix}/images/pngearth.png`} alt="gg" className="earthimage"/>
            </button>
            <a href="https://github.com/Antimatter543/Dataplanet" className="sourcecode"><i>Source code here</i></a>
        </div>
        <Stars className="stars"/>
    </>
    );
}
