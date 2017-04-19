import argon2 from 'argon2';
import crypto from 'crypto';

export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hashPassword(password, salt) {
    if (salt === undefined || Buffer.byteLength(salt) < 8) {
        salt = crypto.randomBytes(32);
    }
    return argon2.hash(password, salt);
}

export function saltAndHash(password, salt) {
    password = Buffer.from(password, 'hex');
    salt = Buffer.from(password, 'hex');
    let concatenated = Buffer.concat([password, salt]);
    return crypto.createHash('sha256').update(concatenated).digest('hex');
}

export function verifyPassword(password, savedMCF) {
    return argon2.verify(savedMCF, password);
}
