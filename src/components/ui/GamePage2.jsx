import React, {useState, useRef } from 'react';
import GameCanvas from "../canvas/GameCanvas"
import PlayerInventory from "./PlayerInventory";
import DeathMenu from './DeathMenuPopup';
import Page from './pages/Page'
import BackgroundColor from "./BackgroundColor";

const PlayerStat = ({ id, text }) => <h2>{text}<span id={id}> </span></h2>
const PlayerStats = () => {
    return (
        <div className='player-stats'>
            <PlayerStat id='status' text='Player Status: ' />
            <PlayerStat id='position' text='Position: ' />
            <PlayerStat id='velocity' text='Velocity: ' />
        </div>
    )
}

export default function GamePage({ gamedata, spritesheet }) {


    const [bgColor, setBgColor] = useState('white')
    const deathMenuRef = useRef(null)
    const canvasRef = useRef(null)



    const handleClick = (e) => {
        e.preventDefault();
        if (bgColor === 'white') setBgColor('black');
        else setBgColor('white');
    }

    return (
        <Page>
            <BackgroundColor handleClick={handleClick} bgColor={bgColor}>
            <div className="container">
                    <PlayerStats />
            
                <GameCanvas gamedata={gamedata} deathMenuRef={deathMenuRef} canvasRef={canvasRef} />
                <PlayerInventory spritesheet={spritesheet} ores={gamedata.frames.ores} skills={[{ name: 'health' }, { name:'mining_speed'}]} />
                <DeathMenu ores={{
                    dirt: gamedata.frames.dirt,
                    ...gamedata.frames.ores,
                }}
                        ref={deathMenuRef}
                        canvasRef={canvasRef}
                />
                </div>
            </BackgroundColor>

        </Page>
    )
}