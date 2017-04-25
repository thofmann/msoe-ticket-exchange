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

export function validateQuantity(quantity) {
    if (quantity === undefined) {
        throw new Error('A quantity must be defined.');
    }
    if (!Number.isInteger(quantity)) {
        throw new Error('A quantity must be a number.');
    }
    if (quantity % 1 !== 0) {
        throw new Error('A quantity must be an integer.');
    }
    if (quantity < 1) {
        throw new Error('A quantity must be positive.');
    }
    if (quantity > 1000 * 1000) {
        throw new Error('A quantity cannot be greater than 1,000,000.');
    }
}

export function validatePrice(price) {
    if (price === undefined) {
        throw new Error('A price must be defined.');
    }
    if (typeof price !== 'number') {
        throw new Error('A price must be a number.');
    }
    if (!Number.isInteger(price)) {
        throw new Error('A price must be an integer.');
    }
    if (price < 1) {
        throw new Error('A price must be positive.');
    }
    if (price > 1000 * 1000 * 1000) {
        throw new Error('A price cannot be greater than 1,000,000,000.');
    }
    if (price % 1000 !== 0) {
        throw new Error('A price must be a multiple of 10,000.');
    }
}

export function validateId(id) {
    if (id === undefined) {
        throw new Error('An id must be defined.');
    }
    if (!Number.isInteger(id)) {
        throw new Error('An id must be a number.');
    }
    if (id % 1 !== 0) {
        throw new Error('An id must be an integer.');
    }
    if (id < 0) {
        throw new Error('An id cannot be negative.');
    }
    if (id > Number.MAX_SAFE_INTEGER) {
        throw new Error(`An id cannot be greater than ${Number.MAX_SAFE_INTEGER}.`);
    }
}
