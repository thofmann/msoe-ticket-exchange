import express from 'express';
import student from './api/student';
import bid from './api/bid';
import ask from './api/ask';
import ticket from './api/ticket';
import announcement from './api/announcement';

let app = express();

app.use((req, res, next) => {
    res.successJson = data => {
        let response = {
            success: true
        };
        if (typeof data === 'object') {
            response.data = data;
        }
        res.json(response);
    };
    res.failureJson = message => {
        let response = {
            success: false
        };
        if (typeof message === 'string') {
            response.message = message;
        }
        res.json(response);
    };
    next();
});

app.use('/student', student);
app.use('/bid', bid);
app.use('/ask', ask);
app.use('/ticket', ticket);
app.use('/announcement', announcement);

export default app;
