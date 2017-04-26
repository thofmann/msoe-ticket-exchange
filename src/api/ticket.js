import express from 'express';
import { publish } from '../lib/database';
import { authenticateAdmin } from '../lib/authenticate';
import { validateQuantity, validateStudentEmail } from '../lib/validate';

let app = express();

app.post('/give', (req, res) => {
    let recipientStudentEmail = req.body.recipientStudentEmail;
    let quantity = req.body.quantity;
    try {
        validateStudentEmail(recipientStudentEmail);
        authenticateAdmin(req.body.studentEmail, req.body.authTokenA, req.body.authTokenB);
        validateQuantity(quantity);
    } catch (e) {
        res.failureJson(e.message);
        return;
    }
    return publish('DEPOSIT_TICKETS', {
        recipientStudentEmail,
        quantity
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
