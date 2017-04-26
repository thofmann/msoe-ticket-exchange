import express from 'express';
import { publish } from '../lib/database';
import { authenticateAdmin } from '../lib/authenticate';
import { validateTitle, validateText } from '../lib/validate';

let app = express();

app.post('/', (req, res) => {
    let title = req.body.title;
    let text = req.body.text;
    try {
        authenticateAdmin(req.body.studentEmail, req.body.authTokenA, req.body.authTokenB);
        validateTitle(title);
        validateText(text);
    } catch (e) {
        res.failureJson(e.message);
        return;
    }
    return publish('MAKE_ANNOUNCEMENT', {
        title,
        text
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
