import crypto from 'crypto';

export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hash(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

export function saltAndHash(password, salt) {
    password = Buffer.from(password, 'hex');
    salt = Buffer.from(password, 'hex');
    let concatenated = Buffer.concat([password, salt]);
    return crypto.createHash('sha256').update(concatenated).digest('hex');
}
