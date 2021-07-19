import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useUser from '../../context/user';
import Game from './game/gameManager';
import MapEditor from '../map-editor-ui/MapEditor';
import Inventory from '../PlayerInventory';
const socket = io('http://localhost:5000')
const game = []

const init = (name, canvasRef, gamedata, then) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const g = new Game(socket, ctx, name,gamedata);
    g.init()
    game.push(g)
}

const  PlayerInfo = ({className}) => <div className={className}><h2>{""}</h2></div>

export default function Canvas({gamedata}) {
    const { user } = useUser()
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const c = canvas.getContext('2d')

        let lastFrameTime, animationId, fps;

        console.log(gamedata)

        const animate = () => {
            c.clearRect(0, 0, c.canvas.width, c.canvas.height);
            
            if (!lastFrameTime) {
                lastFrameTime = performance.now();
                fps = 0;
                requestAnimationFrame(animate)
                return;
            }

            let delta = (performance.now() - lastFrameTime)/1000;
            lastFrameTime = performance.now();

            game.forEach(frame => frame.update(delta))
            
            animationId = window.requestAnimationFrame(animate);
        }

        init(user.username, canvasRef, gamedata)
        animate();

        return () => {
            lastFrameTime =0;
            fps = 0;
            window.cancelAnimationFrame(animationId)
        }
    }, [gamedata, user.username]);

    return (
        <div>
            <PlayerInfo className='player-info' />
            <div className='player-stats'>
                <h2>Player Status: <span id="status"></span></h2>
                <h2><span id="position"></span></h2>
            </div>

            {/* <MapEditor canvasRef={canvasRef} /> */}
            
            <div className='container'>
                <canvas id="canvas" ref={canvasRef}></canvas>
                <Inventory />
           </div>
          
        </div>
    )
}