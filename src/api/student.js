import express from 'express';
import ExchangeStore from '../stores/exchange-store';
import { publish } from '../lib/database';
import { createToken, saltAndHash } from '../lib/crypto';
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
    let salt = createToken();
    let confirmStudentEmailToken = createToken();
    let confirmBackupEmailToken = createToken();
    let hashedPassword = saltAndHash(password, salt);
    /*
    TODO: limit information leakage (e.g. whether or not an email address is in use)
    Maybe just give a successful message whether the registration was successful or not?
    If they have access to their email address, they should be able to reject registrations by others and approve their own.
     */
    publish('NEW_STUDENT', {
        studentEmail,
        backupEmail,
        confirmStudentEmailToken,
        confirmBackupEmailToken,
        hashedPassword,
        salt
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
    if (!student.confirmedStudentEmail) {
        res.failureJson('Please check your student email inbox to verify your address before logging in.');
        return;
    }
    if (!student.confirmedBackupEmail) {
        res.failureJson('Please check your backup email inbox to verify your address before logging in.');
        return;
    }
    let salt = student.salt;
    let hashedPassword = saltAndHash(password, salt);
    if (hashedPassword !== student.hashedPassword) {
        res.failureJson('Incorrect password. Please try again.');
    }
    let authTokenA = createToken(); // token for valid credentials
    let authTokenB = createToken(); // tokens sent to email address
    /*
    TODO: limit information leakage (e.g. whether or not an email address is in use, whether or not the password is correct)
    Maybe just give a successful message whether the registration was successful or not?
    Send an email for failed login attempts? Maybe limit to 1/day?
     */
    return sendAuthenticationToken(student.studentEmail, authTokenB).then(() => {
        return publish('NEW_AUTH_TOKENS', {
            studentEmail,
            authTokenA,
            authTokenB
        });
    }).then(() => {
        res.successJson({
            authTokenA
        });
    }).catch(e => {
        res.failureJson(e.message);
    });
});

app.post('/verify-credentials', (req, res) => {
    let studentEmail = req.body.studentEmail;
    let authTokenA = req.body.authTokenA;
    let authTokenB = req.body.authTokenB;
    try {
        validateStudentEmail(studentEmail);
        validateToken(authTokenA);
        validateToken(authTokenB);
    } catch(e) {
        res.failureJson(e.message);
        return;
    }
    let student = ExchangeStore.getStudent(studentEmail);
    if (student === undefined) {
        res.failureJson('A student could not be found with this email address.');
        return;
    }
    if (student.authTokens.findIndex(t => t.authTokenA === authTokenA && t.authTokenB === authTokenB) === -1) {
        res.failureJson('Authentication tokens are invalid are expired.');
        return;
    }
    res.successJson();
});

export default app;
