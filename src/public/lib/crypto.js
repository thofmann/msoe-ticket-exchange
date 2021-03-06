import crypto from 'crypto';

export function saltAndHash(password, studentEmail) {
    return new Promise((resolve, reject) => {
        let salt = studentEmail;
        crypto.pbkdf2(password, salt, 1e3, 32, 'sha256', (err, key) => {
            if (err) {
                reject(err);
            } else {
                resolve(key.toString('hex'));
            }
        });
    });
}

export function md5(message) {
    return crypto.createHash('md5').update(message).digest('hex');
}
