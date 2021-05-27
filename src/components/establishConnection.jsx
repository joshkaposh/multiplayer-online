import React,{useState, useEffect} from 'react';
import io from 'socket.io-client';
import {UserProvider} from '../context/user'
import CreateUserMenu from './new-user/CreateUserMenu';
import Game from './game/GamePage'
const socket = io('http://localhost:5000')


export default function EstablishConnection() {
    let [isAuth, setAuth] = useState(false);
    const [obj, setObj] = useState({});
    const [gameData,setGameData] = useState({});


    const enterName = (usrname) => {
        socket.emit('nameResponse', { username: usrname, _id: obj._id })
        setObj({...usrname})
    }

    useEffect(() => {

        socket.on('greeting', (data) => {
        setObj({...data})

        })

        socket.on('newUser', (data) => {
            console.log('EstablishConnection::NewUser');
            setObj({ ...data });
        })

        socket.on('oldUser', (data) => {
            console.log('EstablishConnection::OldUser');
            setObj({ ...data });
        
        })
        
        socket.on('loadGame', (data) => {
            console.log('EstablishConnection::LoadGame',data);
            setGameData({ ...data })
            setAuth(true)
            
        })
    })
    return (
        <>
            {isAuth ? <UserProvider usr={obj}><Game socket={socket} data={gameData} /></UserProvider>
                : <CreateUserMenu socket={socket} retry={isAuth} enterName={enterName} />}
        </>
    )
}
