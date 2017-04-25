import express from 'express';
import ExchangeStore from '../stores/exchange-store';
import { publish } from '../lib/database';
import { authenticateStudent } from '../lib/authenticate';
import { validateQuantity, validatePrice } from '../lib/validate';

let app = express();

app.get('/all', (req, res) => {
    res.successJson({
        asks: ExchangeStore.getAsks()
    });
});

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
    return publish('NEW_ASK', {
        studentEmail,
        quantity,
        price
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;