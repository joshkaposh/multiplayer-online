import React from 'react';
import { Route } from 'react-router-dom';
import HomePage from './HomePage';
import EstablishConnection from '../EstablishConnection';

export default function Pages () {
    return (
        <>
            <Route path="/" component={EstablishConnection} exact />
            <Route path="/home" component={HomePage} exact />
        </>
    )
}
