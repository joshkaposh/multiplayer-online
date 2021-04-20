import React,{useState, useEffect} from 'react';
import io from 'socket.io-client';
import useUser from '../context/user'
import CreateUserMenu from './new-user/CreateUserMenu';
import Game from './game/GamePage'
const socket = io('http://localhost:5000')


export default function EstablishConnection() {
    let name = '';
    let [isAuth, setAuth] = useState(false);
    const {ctx:user} = useUser();

    const enterName = (usrname) => {
        socket.emit('nameResponse', usrname)
        user.username = usrname;
        user.username && user._id ? setAuth(true) : setAuth(false);
    }

    useEffect(() => {

        socket.on('greeting', (data) => {
            console.log(data);
            user._id = data._id;
        })

    })
    return (
        <>
            {isAuth ? <Game name={user.username}/>:<CreateUserMenu name={name} enterName={enterName}/>}
        </>
    )
}
