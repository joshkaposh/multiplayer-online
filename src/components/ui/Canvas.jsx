import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useUser from '../../context/user';
import Game from '../canvas/game/gameManager';
import DeathMenuPopup from './DeathMenuPopup';
import PlayerInventory from './PlayerInventory';
import BackgroundColor from './BackgroundColor';

const socket = io('http://localhost:5000')
const game = []

const init = (name, canvasRef, gamedata) => {
    game.length = 0;
    console.log(gamedata);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const g = new Game(socket, ctx, name,gamedata);
    g.init()
    game.push(g)
}

const PlayerStat = ({ id, text }) => <h2>{text}<span id={id}> </span></h2>
const  PlayerInfo = ({className}) => <div className={className}><h2>{""}</h2></div>

export default function Canvas({gamedata,spritesheet}) {
    const { user } = useUser()
    const canvasRef = useRef(null)
    const deathMenuRef = useRef(null)

    const [bgColor, setBgColor] = useState('white')


    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const c = canvas.getContext('2d')

        if (deathMenuRef.current) {

            deathMenuRef.current.classList.toggle('hide', true);
            deathMenuRef.current.classList.toggle('show', false);
            
        }


        let totalFrameTime,lastFrameTime, anId;

        const animate = () => {
            c.clearRect(0, 0, c.canvas.width, c.canvas.height);
            
            if (!lastFrameTime) {
                lastFrameTime = performance.now();
                totalFrameTime = 0;
                requestAnimationFrame(animate)
                return;
            }

            let delta = (performance.now() - lastFrameTime)/1000;
            lastFrameTime = performance.now();
            totalFrameTime += delta;
            game[0].update(delta)

            if (!game[0].player.isAlive) {
                cancelAnimationFrame(anId);
                deathMenuRef.current.classList.toggle('hide', false);
                deathMenuRef.current.classList.toggle('show', true);

                // todo: display death menu, stats
            }
            else anId = window.requestAnimationFrame(animate);
            
        }

            init(user.username, canvasRef, gamedata)
            animate();
        

        return () => {
            lastFrameTime = null;
            window.cancelAnimationFrame(anId)
        }
    }, [gamedata, user.username]);


    const handleClick = (e) => {
        e.preventDefault();
        if (bgColor === 'white') setBgColor('black');
        else setBgColor('white');
    }

    return (
        <BackgroundColor handleClick={handleClick} bgColor={bgColor}>
            <PlayerInfo className='player-info' />
            <div className='player-stats'>
                <PlayerStat id='status' text='Player Status: ' />
                <PlayerStat id='position' text='Position: ' />
                <PlayerStat id='velocity' text='Velocity: ' />
            </div>
            <div className='container'>
                <DeathMenuPopup ores={{
                    dirt: gamedata.frames.dirt,
                    ...gamedata.frames.ores,
                }}
                    ref={deathMenuRef}
                />
                <canvas id="canvas" ref={canvasRef}></canvas>

                <PlayerInventory spritesheet={spritesheet} ores={gamedata.frames.ores} skills={[{ name: 'health' }, { name:'mining_speed'}]} />
            </div>
            </ BackgroundColor>
    )
}