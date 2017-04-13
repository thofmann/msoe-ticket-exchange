import path from 'path';
import express from 'express';

let app = express();

app.use(express.static(path.join(__dirname, './public')));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(8080, 'localhost');
