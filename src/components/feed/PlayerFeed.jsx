import React, {useEffect, useState} from 'react';

export default function PlayerFeed({ socket }) {
    const [players, setPlayers] = useState([]);
    
    useEffect(() => {
        socket.on('newPlayer', ({username, _id}) => {
            console.log('new Player Connected');
            setPlayers([...players, { username, _id }])

        })
    })

    return (
        <div>
            <h2>Player Count: {players.length}</h2>
            <h3>Most Recent: {
                players.length === 0 ?
                    '' :
                    players[players.length - 1].username
            }  </h3>
        </div>
    )
}