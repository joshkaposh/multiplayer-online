import React from 'react';
import Page from './Page'
import Canvas from '../Canvas';
import StartGame from '../StartGame';
import GameCanvas from '../../canvas/GameCanvas';


export default function GamePage({data}) {

    return (
        <Page content={
                    // <Canvas gamedata={data} StartGame={StartGame} />
                    <GameCanvas gamedata={data} StartGame={StartGame} />

        } />
        
    )
}