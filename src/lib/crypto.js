import crypto from 'crypto';

export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hash(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

export function saltAndHash(password, salt) {
    return new Promise((resolve, reject) => {
        if (salt === undefined || Buffer.byteLength(salt) < 8) {
            salt = crypto.randomBytes(32);
        }
        crypto.pbkdf2(password, salt, 1e5, 512, 'sha256', (err, key) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    hash: key.toString('hex'),
                    salt
                });
            }
        });
    });
}
