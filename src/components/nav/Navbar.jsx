import React from 'react';
// import useUser from '../../context/user'
import {NavLink} from 'react-router-dom'
export default function Navbar() {

    return (
        <div>
            <nav>
                <li><NavLink to={{ pathname:'/home'}} >Home</NavLink></li>
                <li><button href="#">Logout</button></li>

            </nav>
        </div>
    )
}