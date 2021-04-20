import React from 'react';

function resize() {
    const canvas = document.getElementById('canvas')
    canvas.width = 400;
    canvas.height = 300;
}

export default function Canvas() {
    return <canvas id="canvas">{resize()}</canvas>
}