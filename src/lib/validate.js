import validator from 'validator';

function validateEmail(email) {
    if (email === undefined) {
        throw new Error('An email address must be defined.');
    }
    if (typeof email !== 'string') {
        throw new Error('An email address must be a string.');
    }
    if (!validator.isEmail(email)) {
        throw new Error('A valid email address must be provided.');
    }
}

export function validateStudentEmail(email) {
    validateEmail(email);
    if (email.split('@')[1] !== 'msoe.edu') {
        throw new Error('A student email address must be "@msoe.edu".');
    }
}

export function validateBackupEmail(email) {
    validateEmail(email);
    if (email.split('@')[1] === 'msoe.edu') {
        throw new Error('A backup email address cannot be "@msoe.edu".');
    }
}

export function validatePassword(password) {
    if (password === undefined) {
        throw new Error('A password must be defined.');
    }
    if (typeof password !== 'string') {
        throw new Error('A password must be a string.');
    }
    if (!validator.isLowercase(password)) {
        throw new Error('A password must be lowercase.');
    }
    if (!validator.isHexadecimal(password)) {
        throw new Error('A password must be hexadecimal.');
    }
    if (password.length !== 64) {
        throw new Error('A password must be 64 characters (256 bits).');
    }
}
