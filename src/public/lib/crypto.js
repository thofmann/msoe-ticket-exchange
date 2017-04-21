import crypto from 'crypto';

export function hash(password) {
    return new Promise((resolve, reject) => {
        let salt = crypto.randomBytes(8);
        crypto.pbkdf2(password, salt, 1e3, 256, 'sha256', (err, key) => {
            if (err) {
                reject(err);
            } else {
                resolve(key.toString('hex'));
            }
        });
    });
}
