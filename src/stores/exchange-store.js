import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

const FEE = 0.05;

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

function createTransaction(studentEmail, currency, amount, description, timestamp) {
    let student = students.get(studentEmail);
    student.transactions.unshift({
        currency,
        amount,
        description,
        timestamp
    });
    student.balance[currency] -= amount;
}

function insertBid(quantity, price, studentEmail) {
    for (let i = 0; i <= bids.length; i++) {
        if (bids[i].price < price) {
            bids.splice(i, 0, {
                quantity,
                price,
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
        transactions: [] // descending by timestamp
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
    let studentEmail = data.studentEmail;
    let quantity = data.quantity;
    let price = data.price;
    let timestamp = data.timestamp;
    let student = students.get(studentEmail);
    if (student === undefined) {
        throw new Error('This student email address is not in use.');
    }
    if (student.balance.satoshis < quantity * price) {
        throw new Error('You do not have enough satoshis to place this bid.');
    }
    let totalSatoshisPaid = 0;
    let ticketsRemaining = quantity;
    while (ticketsRemaining > 0) {
        if (asks[0].price <= price) {
            if (asks[0].quantity <= ticketsRemaining) {
                let ticketsExchanged = asks[0].quantity;
                let satoshisPaid = ticketsExchanged * asks[0].price;
                let satoshisReceived = Math.ceil(satoshisPaid * (1 - FEE));
                totalSatoshisPaid += satoshisPaid;
                ticketsRemaining -= ticketsExchanged;
                createTransaction(asks[0].studentEmail, 'satoshis', satoshisReceived, 'Ask filled', timestamp);
                asks.shift();
            } else {
                let ticketsExchanged = ticketsRemaining;
                let satoshisPaid = ticketsExchanged * asks[0].price;
                let satoshisReceived = Math.ceil(satoshisPaid * (1 - FEE));
                totalSatoshisPaid += satoshisPaid;
                ticketsRemaining -= ticketsExchanged;
                createTransaction(asks[0].studentEmail, 'satoshis', satoshisReceived, 'Ask partially filled', timestamp);
                asks[0].quantity -= ticketsExchanged;
            }
        } else {
            totalSatoshisPaid += ticketsRemaining * price;
            insertBid(ticketsRemaining, price, studentEmail);
        }
    }
    createTransaction(studentEmail, 'satoshis', -1 * totalSatoshisPaid, 'Bid placed', timestamp);
    let ticketsBought = quantity - ticketsRemaining;
    if (ticketsBought > 0) {
        let description = ticketsBought === quantity ? 'Bid filled' : 'Bid partially filled';
        createTransaction(studentEmail, 'tickets', ticketsBought, description, timestamp);
    }
});

export default store;
