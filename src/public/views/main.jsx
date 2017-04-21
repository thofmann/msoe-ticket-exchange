import React from 'react';
import ReactDOM from 'react-dom';
import websocket from '../lib/websocket';
import App from './app.jsx';

ReactDOM.render(<App />, document.getElementById('app-container'));

websocket();
