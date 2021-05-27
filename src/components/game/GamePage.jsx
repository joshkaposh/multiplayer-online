import React from 'react';
import Page from '../pages/Page'
import Canvas from '../canvas/Canvas';
import useUser from '../../context/user'


export default function GamePage({data}) {

    const user = useUser();
    // console.log(user);
    // console.log('DATA',data);

    return (
        <Page content={
                <div>
                    <Canvas gamedata={data} />
                </div>
        } />
        
    )
}