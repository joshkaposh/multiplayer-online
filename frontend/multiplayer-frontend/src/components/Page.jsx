import React from 'react';
import Navbar from './nav/Navbar';

export default function Page({content}) {

    return (
        <div>
            <Navbar />
            {content}
        </div>
    )
}