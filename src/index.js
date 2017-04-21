import http from 'http';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import websocket from './lib/websocket';
import api from './api';
import config from '../config.json';

const app = express();

app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.json());

app.use('/api', api);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

const server = http.createServer(app);

websocket(server);

server.listen(config.server.port, 'localhost');
