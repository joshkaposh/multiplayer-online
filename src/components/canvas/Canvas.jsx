import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useUser from '../../context/user';
import Game from './game/gameManager';
import MapEditor from '../map-editor-ui/MapEditor';

const socket = io('http://localhost:5000')

const game = []

const  init =(name, canvasRef, gamedata) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 600;
    ctx.canvas.height = 400;

    const g = new Game(socket, ctx, name,gamedata);
    g.init()
    game.push(g)
}

export default function Canvas({gamedata}) {

    const { user } = useUser()
    const canvasRef = useRef(null)

    useEffect(() => {

        let animationId;

        console.log(gamedata)

        const  animate = () => {
            const canvas = document.getElementById('canvas');
            const c = canvas.getContext('2d')
            c.strokeStyle = "#000000";
            c.fillStyle = '#000000'
            c.clearRect(0, 0, c.canvas.width, c.canvas.height);
            c.fillRect(0,0,c.canvas.width,c.canvas.height)
            game.forEach(frame => frame.update());
       
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
            <canvas id="canvas" ref={canvasRef}></canvas>
            <MapEditor canvasRef={canvasRef} />
            <table className='MapInfo'>
                <thead>
                <tr>
                    <th>world_width</th>
                    <th>world_height</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{gamedata.columns * gamedata.tilesize}</td>
                    <td>{gamedata.rows * gamedata.tilesize}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}