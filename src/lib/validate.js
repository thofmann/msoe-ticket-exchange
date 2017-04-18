import validator from 'validator';

export function validateStudentEmail(email) {
    if (email === undefined) {
        throw new Error('A student email address must be defined.');
    }
    if (typeof email !== 'string') {
        throw new Error('A student email address must be a string.');
    }
    if (!validator.isEmail(email)) {
        throw new Error('A valid student email address must be provided.');
    }
    if (email.split('@')[1] !== 'msoe.edu') {
        throw new Error('A student email address must be "@msoe.edu".');
    }
}

export function validateBackupEmail(email) {
    if (email === undefined) {
        throw new Error('A backup email address must be defined.');
    }
    if (typeof email !== 'string') {
        throw new Error('A backup email address must be a string.');
    }
    if (!validator.isEmail(email)) {
        throw new Error('A valid backup email address must be provided.');
    }
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

export function validateToken(token) {
    if (token === undefined) {
        throw new Error('A token must be defined.');
    }
    if (typeof token !== 'string') {
        throw new Error('A token must be a string.');
    }
    if (!validator.isLowercase(token)) {
        throw new Error('A token must be lowercase.');
    }
    if (!validator.isHexadecimal(token)) {
        throw new Error('A token must be hexadecimal.');
    }
    if (token.length !== 64) {
        throw new Error('A token must be 64 characters (256 bits).');
    }
}

export function validateAccept(accept) {
    if (typeof accept !== 'boolean') {
        throw new Error('The accept parameter must be a boolean.');
    }
}
