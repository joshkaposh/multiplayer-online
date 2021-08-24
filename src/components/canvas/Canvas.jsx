import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useUser from '../../context/user';
import Game from './game/gameManager';
import DeathMenu from '../DeathMenu';
import PlayerInventory from '../PlayerInventory_new';

const socket = io('http://localhost:5000')
const game = []

const init = (name, canvasRef, gamedata) => {
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

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const c = canvas.getContext('2d')

        let totalFrameTime,lastFrameTime, animationId;

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
            game.forEach(frame => frame.update(delta,totalFrameTime))
            
            animationId = window.requestAnimationFrame(animate);
        }

            init(user.username, canvasRef, gamedata)
            animate();
        

        return () => {
            lastFrameTime = null;
            window.cancelAnimationFrame(animationId)
        }
    }, [gamedata, user.username]);

    return (
        <div>
            <PlayerInfo className='player-info' />
            <div className='player-stats'>
                <PlayerStat id='status' text='Player Status: ' />
                <PlayerStat id='position' text='Position: ' />
                <PlayerStat id='velocity' text='Velocity: ' />
            </div>
            <div className='container'>
                <canvas id="canvas" ref={canvasRef}></canvas>
                <DeathMenu ores={{
                    dirt: gamedata.frames.dirt,
                    ...gamedata.frames.ores,
                }} />
                <PlayerInventory spritesheet={spritesheet} ores={gamedata.frames.ores} skills={[{ name: 'health' }, { name:'mining_speed'}]} />
           </div>
        </div>
    )
}