import express from 'express';
import { publish } from '../lib/database';
import { createToken, saltAndHash } from '../lib/crypto';
import { validateStudentEmail, validateBackupEmail, validatePassword } from '../lib/validate';

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
