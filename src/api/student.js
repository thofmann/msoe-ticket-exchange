import express from 'express';
import { publish } from '../lib/database';
import { createToken, saltAndHash } from '../lib/crypto';
import {
    validateStudentEmail,
    validateBackupEmail,
    validatePassword,
    validateToken,
    validateAccept
} from '../lib/validate';

let app = express();

app.post('/register', (req, res) => {
    let studentEmail = req.body.studentEmail;
    let backupEmail = req.body.backupEmail;
    let password = req.body.password;
    try {
        validateStudentEmail(studentEmail);
        validateBackupEmail(backupEmail);
        validatePassword(password);
    } catch(e) {
        res.failureJson(e.message);
        return;
    }
    let salt = createToken();
    let confirmStudentEmailToken = createToken();
    let confirmBackupEmailToken = createToken();
    let hashedPassword = saltAndHash(req.body.password, salt);
    publish('NEW_STUDENT', {
        studentEmail,
        backupEmail,
        confirmStudentEmailToken,
        confirmBackupEmailToken,
        hashedPassword,
        salt
    }).then(() => {
        // TODO: send confirmation emails after successfully creating student
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.post('/verify', (req, res) => {
    let accept = req.body.accept;
    let token = req.body.token;
    try {
        validateAccept(accept);
        validateToken(token);
    } catch(e) {
        res.failureJson(e.message);
        return;
    }
    publish('VERIFY_EMAIL', {
        accept,
        token
    }).then(() => {
        res.successJson();
    }).catch(e => {
        res.failureJson(e.message);
    });
});

export default app;
