import ExchangeStore from '../stores/exchange-store';
import { hash } from '../lib/crypto';
import {
    validateStudentEmail,
    validateToken
} from '../lib/validate';

export function authenticateStudent(studentEmail, authTokenA, authTokenB) {
    validateStudentEmail(studentEmail);
    validateToken(authTokenA);
    validateToken(authTokenB);
    let hashedAuthTokenA = hash(authTokenA);
    let hashedAuthTokenB = hash(authTokenB);
    let student = ExchangeStore.getStudent(studentEmail);
    if (student === undefined) {
        throw new Error('A student could not be found with this email address.');
    }
    if (student.hashedAuthTokens.findIndex(h => h.a === hashedAuthTokenA && h.b === hashedAuthTokenB) === -1) {
        throw new Error('Authentication tokens are invalid or expired.');
    }
    return student;
}
