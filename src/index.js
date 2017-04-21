import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import api from './api';
import config from '../config.json';

let app = express();

app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.json());

app.use('/api', api);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(config.server.port, 'localhost');
