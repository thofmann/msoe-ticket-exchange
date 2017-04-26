import express from 'express';
import { publish } from '../lib/database';
import { authenticateStudent } from '../lib/authenticate';
import { validateQuantity, validatePrice, validateId } from '../lib/validate';

let app = express();

app.post('/', (req, res) => {
    let studentEmail = req.body.studentEmail;
    let quantity = req.body.quantity;
    let price = req.body.price;
    try {
        authenticateStudent(studentEmail, req.body.authTokenA, req.body.authTokenB);
        validateQuantity(quantity);
        validatePrice(price);
    } catch (e) {
        res.failureJson(e.message);
        return;
    }
    return publish('NEW_BID', {
        studentEmail,
        quantity,
        price
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.post('/cancel', (req, res) => {
    let studentEmail = req.body.studentEmail;
    let id = req.body.id;
    try {
        authenticateStudent(studentEmail, req.body.authTokenA, req.body.authTokenB);
        validateId(id);
    } catch (e) {
        res.failureJson(e.message);
        return;
    }
    return publish('CANCEL_BID', {
        studentEmail,
        id
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
