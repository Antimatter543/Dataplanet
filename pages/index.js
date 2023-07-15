import { useState } from 'react'
import Head from 'next/head'
import Intro from '../components/Intro.js'
import Main from '../components/Main.js'
import Script from "next/script";

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
        <Main/>
        </>
    );
}