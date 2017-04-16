import validator from 'validator';

function validateEmail(email) {
    if (email === undefined) {
        throw new Error('An email address must be defined.');
    }
    if (typeof email !== 'string') {
        throw new Error('An email address must be a string.');
    }
    if (!validate.isEmail(email)) {
        throw new Error('A valid email address must be provided.')
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
