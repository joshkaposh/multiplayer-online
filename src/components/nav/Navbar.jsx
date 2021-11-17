import React from 'react';
import {NavLink} from 'react-router-dom'
export default function Navbar() {
//! canvas rendering bug occurs after going home > logout > relogging-in
    return (
        <div>
            <nav>
                <ul className="nav">
                <li><NavLink to={{ pathname:'/home'}} >Home</NavLink></li>
                <li><NavLink to={{pathname:'/'}} >Logout</NavLink></li>
                </ul>
            </nav>
        </div>
    )
}