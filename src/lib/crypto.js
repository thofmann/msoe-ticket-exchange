import crypto from 'crypto';
import config from '../../config.json';

export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hash(message) {
    return crypto.createHash(config.crypto.hash).update(message).digest('hex');
}

export function saltAndHash(password, salt) {
    return new Promise((resolve, reject) => {
        password = Buffer.from(password, 'hex');
        salt = Buffer.from(salt, 'hex');
        crypto.pbkdf2(password, salt, config.crypto.iterations, 32, config.crypto.hash, (err, key) => {
            if (err) {
                reject(err);
            } else {
                resolve(key.toString('hex'));
            }
        });
    });
}
