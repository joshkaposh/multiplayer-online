import React, {useRef, useEffect} from 'react';
import Game from './game/gameManager';
import io from 'socket.io-client';

const socket = io('http://localhost:5000')
const game = [];

const initCanvas = (username, canvasRef,gamedata) => {
    game.length = 0;
    console.log(gamedata);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const g = new Game(socket, ctx, null,gamedata);
    g.init()
    game.push(g)
}


export default function GameCanvas({gamedata, deathMenuRef,canvasRef}) {

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

            initCanvas(null, canvasRef, gamedata)
            animate();
        

        return () => {
            lastFrameTime = null;
            window.cancelAnimationFrame(anId)
        }
    }, [gamedata]);



    return <canvas id="canvas" ref={canvasRef}></canvas>
}