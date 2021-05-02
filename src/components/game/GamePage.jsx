import React,{useState} from 'react';
import Page from '../Page'
import Canvas from '../canvas/Canvas';
import DisplayName from '../DisplayName'
// import PlayerFeed from '../feed/PlayerFeed';
import useUser from '../../context/user'


export default function GamePage() {

    const user = useUser();
    console.log(user);

    return (
        <Page content={
                <div>
                    <DisplayName user={user}/>
                <Canvas />
                </div>

        } />
        
    )
}