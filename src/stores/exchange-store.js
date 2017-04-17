import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let students = new Map();
let bids = []; // descending bid price
let asks = []; // ascending ask price

function getStudentByBackupEmail(email) {
    for (let student of students) {
        if (student.backupEmail === email) {
            return clone(student);
        }
    }
}

function insertBid(price, quantity, studentEmail) {
    for (let i = 0; i <= bids.length; i++) {
        if (bids[i].price < price) {
            bids.splice(i, 0, {
                price,
                quantity,
                studentEmail
            });
        }
    }
}

class ExchangeStore extends Store {

    getStudent(email) {
        return clone(students.get(email));
    }

    getStudentByBackupEmail(email) {
        return clone(getStudentByBackupEmail(email));
    }

    getBids(count = Infinity) {
        return clone(bids.slice(0, count));
    }

    getAsks(count = Infinity) {
        return clone(asks.slice(0, count));
    }

}

const store = new ExchangeStore();

store.registerHandler('NEW_STUDENT', data => {
    if (students.has(data.email)) {
        throw new Error('This student email address is already in use.');
    }
    if (getStudentByBackupEmail(data.backupEmail) !== undefined) {
        throw new Error('This backup email address is already in use.');
    }
    students.set(data.studentEmail, {
        studentEmail: data.studentEmail,
        backupEmail: data.backupEmail,
        confirmedStudentEmail: false,
        confirmedBackupEmail: false,
        confirmStudentEmailToken: data.confirmStudentEmailToken,
        confirmBackupEmailToken: data.confirmBackupEmailToken,
        hashedPassword: data.hashedPassword,
        salt: data.salt,
        balance: {
            tickets: 0,
            satoshis: 0
        },
        transactions: []
    });
});

store.registerHandler('CONFIRM_STUDENT_EMAIL', data => {
    let student = students.get(data.studentEmail);
    if (student === undefined) {
        throw new Error('This student email address is not in use.');
    }
    if (student.confirmedStudentEmail) {
        throw new Error('This student email address is already confirmed.');
    }
    if (data.confirmStudentEmailToken !== student.confirmStudentEmailToken) {
        throw new Error('Invalid student email confirmation token.');
    }
    student.confirmedStudentEmail = true;
});

store.registerHandler('CONFIRM_BACKUP_EMAIL', data => {
    let student = getStudentByBackupEmail(data.backupEmail);
    if (student === undefined) {
        throw new Error('This backup email address is not in use.');
    }
    if (student.confirmedBackupEmail) {
        throw new Error('This student email address is already confirmed.');
    }
    if (data.confirmBackupEmailToken !== student.confirmBackupEmailToken) {
        throw new Error('Invalid backup email confirmation token.');
    }
    student.confirmedBackupEmail = true;
});

store.registerHandler('NEW_BID', data => {
    let student = students.get(data.studentEmail);
    if (student === undefined) {
        throw new Error('This student email address is not in use.');
    }
    if (student.balance.satoshis < data.quantity * data.price) {
        throw new Error('You do not have enough satoshis to place this bid.');
    }
    let remaining = data.quantity;
    while (remaining > 0) {
        if (asks[0].price <= data.price) {
            if (asks[0].quantity <= remaining) {
                remaining -= asks[0].quantity;
                asks.shift();
                // TODO: credit students
            } else {
                asks[0].quantity -= remaining;
                remaining = 0;
                // TODO: credit students
            }
        } else {
            insertBid(data.price, remaining, data.studentEmail);
        }
    }
});

export default store;
