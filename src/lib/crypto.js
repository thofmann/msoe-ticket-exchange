import crypto from 'crypto';

export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hash(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

export function saltAndHash(password, salt) {
    return new Promise((resolve, reject) => {
        password = Buffer.from(password, 'hex');
        salt = Buffer.from(salt, 'hex');
        crypto.pbkdf2(password, salt, 1e5, 512, 'sha256', (err, key) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    hash: key.toString('hex'),
                    salt: salt.toString('hex')
                });
            }
        });
    });
}
