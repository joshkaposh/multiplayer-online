import React from 'react';
import Page from '../pages/Page'
import Canvas from '../canvas/Canvas';


export default function GamePage({data}) {

    return (
        <Page content={
                <div>
                    <Canvas gamedata={data} />
                </div>
        } />
        
    )
}