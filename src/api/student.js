import express from 'express';
import ExchangeStore from '../stores/exchange-store';
import { publish } from '../lib/database';
import { createToken, hashPassword, verifyPassword } from '../lib/crypto';
import {
    validateStudentEmail,
    validateBackupEmail,
    validatePassword,
    validateToken,
    validateAccept
} from '../lib/validate';
import { sendConfirmationToken, sendAuthenticationToken } from '../lib/mail';

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
    let confirmStudentEmailToken = createToken();
    let confirmBackupEmailToken = createToken();
    hashPassword(password).then(modularCryptFmt => {
        return publish('NEW_STUDENT', {
            studentEmail,
            backupEmail,
            confirmStudentEmailToken,
            confirmBackupEmailToken,
            hashedPassword: modularCryptFmt
        });
    }).then(() => {
        return sendConfirmationToken(studentEmail, confirmStudentEmailToken);
    }).then(() => {
        return sendConfirmationToken(backupEmail, confirmBackupEmailToken);
    }).then(() => {
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

app.post('/login', (req, res) => {
    let studentEmail = req.body.studentEmail;
    let password = req.body.password;
    try {
        validateStudentEmail(studentEmail);
        validatePassword(password);
    } catch(e) {
        res.failureJson(e.message);
        return;
    }
    let student = ExchangeStore.getStudent(studentEmail);
    if (student === undefined) {
        res.failureJson('A student could not be found with this email address.');
        return;
    }
    let authTokenA = createToken(); // token for valid credentials
    let authTokenB = createToken(); // tokens sent to email address
    verifyPassword(password, student.hashedPassword).then(match => {
        if (!match) {
            res.failureJson('Incorrect password. Please try again.');
            return;
        } else {
            return sendAuthenticationToken(student.studentEmail, authTokenB);
        }
    }).then(() => {
        return publish('NEW_AUTH_TOKENS', {
            studentEmail,
            authTokenA,
            authTokenB
        });
    }).then(() => {
        res.successJson({
            authTokenA
        });
    });
});

export default app;
