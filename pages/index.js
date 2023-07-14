import { useState } from 'react'
import Head from 'next/head'
import Intro from '../components/Intro.js'
import Globe from '../components/Globe.js'

export default function Index() {
    const [started, setStarted] = useState(false);
    function handleClick() {
        setStarted(true);
    }

    return (
        <>
        <Head>
            <title>Data Planet</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </Head>
        {started ? <Globe/> : <Intro onClick={handleClick}/>}
        </>
    );
}