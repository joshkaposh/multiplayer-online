import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useUser from '../../context/user';
import Game from './game/gameManager';
import MapEditor from '../map-editor-ui/MapEditor';

const socket = io('http://localhost:5000')

const game = []

let delta = 0;

const  init =(name, canvasRef, gamedata) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 600;
    ctx.canvas.height = 400;

    console.log(name)

    const g = new Game(socket, ctx, name,gamedata);
    g.init()
    game.push(g)
}

function reset() {
    delta = 0;
}

export default function Canvas({gamedata}) {

    const { user } = useUser()
    const canvasRef = useRef(null)

    useEffect(() => {

        let animationId;

        var lastFrameTimeMs = 0, // The last time the loop was run
       maxFPS = 30; // The maximum FPS we want to allow
        let timestep = 1000 / 60
        let numUpdateSteps = 0;
        console.log(gamedata)

        const animate = (timestamp) => {
            const canvas = document.getElementById('canvas');
            const c = canvas.getContext('2d')
            c.strokeStyle = "#000000";
            c.fillStyle = '#000000'
            c.clearRect(0, 0, c.canvas.width, c.canvas.height);
            c.fillRect(0, 0, c.canvas.width, c.canvas.height)
            
            // // throttle the frame rate.
            // if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
            //     requestAnimationFrame(animate);
            //     return () => {
            //         window.cancelAnimationFrame(animationId)
            //     }
            // }

            // Track the accumulated time that hasn't been simulated yet
            // delta += timestamp - lastFrameTimeMs;
            
            // Simulate the total elapsed time in fixed-suze chunks
            // while (delta >= timestep) {
            //     delta -= timestep;

            //     // Sanity check
            //     if (++numUpdateSteps >= 240) {
            //         reset();
            //         break;
            //     }
                
            // }

            game.forEach(frame => frame.update())

            animationId = window.requestAnimationFrame(animate);
        }

        init(user.username, canvasRef, gamedata)
        animate();

        return () => {
            window.cancelAnimationFrame(animationId)
        }
    }, []);

    return (
        <div>
            <div className='player-info'><h2></h2></div>
            <div className='player-stats'><h2 id="score"></h2></div>

            <canvas id="canvas" ref={canvasRef}></canvas>
            <MapEditor canvasRef={canvasRef} />
            <table className='MapInfo'>
                <thead>
                <tr>
                    <th >world_width</th>
                    <th>world_height</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td id='world-width'>{gamedata.columns * gamedata.tilesize}</td>
                    <td id='world-height'>{gamedata.rows * gamedata.tilesize}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}