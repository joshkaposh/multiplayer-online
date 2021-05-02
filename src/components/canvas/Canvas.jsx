import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useUser from '../../context/user';
import Game from './game/gameManager';
import MapEditor from '../map-editor-ui/MapEditor';

const socket = io('http://localhost:5000')

const mouse = {
    x: null,
    y: null,
    selection: null,
}


const game = []


function init(name, canvasRef, mapEditorSelectFn) {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 600;
    ctx.canvas.height = 400;

    const g = new Game(socket, ctx, name);
    g.init()
    game.push(g)
    return game;

}

const isMouseWithinCanvas = () => {
    const canvas = document.getElementById('canvas');
    if (mouse.x >= 0 &&
        mouse.x <= canvas.width &&
        mouse.y >= 0 &&
        mouse.y <= canvas.height
    ) {
        return true
    }
    return false;
}

function animate() {

    const canvas = document.getElementById('canvas');
    const c = canvas.getContext('2d')
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    c.strokeStyle = "#000000";

    socket.on("playerMove", (data) => {
        c.fillRect(data.x, data.y, 10, 10);
    });

    game.forEach(frame => frame.update());

    // isMouseWithinCanvas() ? c.fillRect(mouse.x,mouse.y,3,3) : c.stroke()

    requestAnimationFrame(animate);

}



export default function Canvas() {
    const [selection, setSelection] = useState('none')

    const { user } = useUser()
    console.log(user);
    const canvasRef = useRef(null)

    const select = (value) => {
        setSelection(value)
    }


    useEffect(() => {

        init(user.username, canvasRef, select)



        // document.addEventListener('mousemove', (e) => {
        //     mouse.x = e.offsetX;
        //     mouse.y = e.offsetY
        // })



        animate();

    }, []);


    return (
        <div>
            <canvas id="canvas" ref={canvasRef}></canvas>
            <MapEditor selection={selection} setSelection={select} canvasRef={canvasRef} />
        </div>
    )
}