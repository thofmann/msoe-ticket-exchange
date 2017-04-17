import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import api from './api';

let app = express();

app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParse.json());

app.use('/api', api);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(8080, 'localhost');
