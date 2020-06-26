import React from 'react';
import {Navbar, Alignment, Icon} from '@blueprintjs/core';
import './App.css';
import '@blueprintjs/icons/resources/icons/icons-16.ttf';
import '@blueprintjs/icons/resources/icons/icons-16.eot';

const App: React.FC = () => (
    <div className="app">
        <Navbar className="foo">
            <Navbar.Group>
                <Navbar.Heading>Dapamaji.by</Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Icon icon="user"/>
            </Navbar.Group>
        </Navbar>
    </div>
);

export default App;
