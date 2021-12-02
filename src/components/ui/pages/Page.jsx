import React from 'react';
import Navbar from '../../nav/Navbar';

export default function Page(props) {

    return (
        <div>
            <Navbar />
            {props.content || props.children}
        </div>
    )
}