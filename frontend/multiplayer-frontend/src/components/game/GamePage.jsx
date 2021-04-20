import React from 'react';
import Page from '../Page'
import Canvas from '../canvas/Canvas';
import DisplayName from '../DisplayName'

export default function GamePage(props) {
console.log(props);
    return (
        <Page content={

            <div>
                <DisplayName name={props.name}/>
                <Canvas/>
            </div>

        } />
        
    )
}