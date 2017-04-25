import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

const FEE = 0.05;

let students = new Map();
let bids = []; // descending bid price
let asks = []; // ascending ask price
let totalTicketsExchanged = 0;
let lastPrice;
let nextBidId = 0;
let nextAskId = 0;

function getStudentByBackupEmail(email) {
    for (let student of students.values()) {
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
    student.balance[currency] += amount;
}

function insertBid(quantity, price, studentEmail) {
    let id = nextBidId;
    nextBidId++;
    let bid = {
        id,
        quantity,
        price,
        studentEmail
    };
    for (let i = 0; i < bids.length; i++) {
        if (bids[i].price < price) {
            bids.splice(i, 0, bid);
            return;
        }
    }
    bids.push(bid);
}

function insertAsk(quantity, price, studentEmail) {
    let id = nextAskId;
    nextAskId++;
    let ask = {
        id,
        quantity,
        price,
        studentEmail
    };
    for (let i = 0; i < asks.length; i++) {
        if (asks[i].price > price) {
            asks.splice(i, 0, ask);
            return;
        }
    }
    asks.push(ask);
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

    getAnonymizedBids(count = Infinity) {
        let r = [];
        for (let i = 0; i < bids.length; i++) {
            let price = bids[i].price;
            let quantity = bids[i].quantity;
            if (r.length === 0 || r[r.length - 1].price !== price) {
                if (r.length === count) {
                    break;
                }
                r.push({
                    quantity,
                    price
                });
            } else {
                r[r.length - 1].quantity += quantity;
            }
        }
        return r;
    }

    getAnonymizedAsks(count = Infinity) {
        let r = [];
        for (let i = 0; i < asks.length; i++) {
            let price = asks[i].price;
            let quantity = asks[i].quantity;
            if (r.length === 0 || r[r.length - 1].price !== price) {
                if (r.length === count) {
                    break;
                }
                r.push({
                    quantity,
                    price
                });
            } else {
                r[r.length - 1].quantity += quantity;
            }
        }
        return r;
    }

    getAsks(count = Infinity) {
        return clone(asks.slice(0, count));
    }

    getRegisteredStudentsCount() {
        return Array.from(students.values()).filter(student => {
            return student.confirmedStudentEmail && student.confirmedBackupEmail;
        }).length;
    }

    getTicketsExchangedCount() {
        return totalTicketsExchanged;
    }

    getLastPrice() {
        return lastPrice;
    }

}

const store = new ExchangeStore();

store.registerHandler('NEW_STUDENT', data => {
    let studentEmail = data.studentEmail;
    let backupEmail = data.backupEmail;
    let confirmStudentEmailToken = data.confirmStudentEmailToken;
    let confirmBackupEmailToken = data.confirmBackupEmailToken;
    let hashedPassword = data.hashedPassword;
    let salt = data.salt;
    if (students.has(studentEmail)) {
        throw new Error('This student email address is already in use.');
    }
    if (getStudentByBackupEmail(backupEmail) !== undefined) {
        throw new Error('This backup email address is already in use.');
    }
    students.set(studentEmail, {
        studentEmail,
        backupEmail,
        confirmedStudentEmail: false,
        confirmedBackupEmail: false,
        confirmStudentEmailToken,
        confirmBackupEmailToken,
        hashedPassword,
        salt,
        hashedAuthTokens: [],
        balance: {
            tickets: 100, // TODO: 0
            satoshis: 100000000 // TODO: 0
        },
        transactions: [] // descending by timestamp
    });
    store.emitChange();
});

store.registerHandler('VERIFY_EMAIL', data => {
    for (let student of students.values()) {
        if (student.confirmStudentEmailToken === data.token) {
            if (student.confirmedStudentEmail) {
                throw new Error('This email address was already verified.');
            }
            if (data.accept) {
                student.confirmedStudentEmail = true;
            } else {
                students.delete(student.studentEmail);
            }
            store.emitChange();
            return;
        }
    }
    for (let student of students.values()) {
        if (student.confirmBackupEmailToken === data.token) {
            if (student.confirmedBackupEmail) {
                throw new Error('This email address was already verified.');
            }
            if (data.accept) {
                student.confirmedBackupEmail = true;
            } else {
                students.delete(student.studentEmail);
            }
            store.emitChange();
            return;
        }
    }
    throw new Error('This verification token is invalid.');
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
    store.emitChange();
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
    store.emitChange();
});

store.registerHandler('NEW_AUTH_TOKENS', data => {
    let student = students.get(data.studentEmail);
    if (student === undefined) {
        throw new Error('This student email address is not in use.');
    }
    student.hashedAuthTokens.push({
        a: data.hashedAuthTokenA,
        b: data.hashedAuthTokenB
    });
    store.emitChange();
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
        throw new Error('You do not have enough bitcoins to place this bid.');
    }
    let totalSatoshisPaid = 0;
    let ticketsRemaining = quantity;
    while (ticketsRemaining > 0) {
        if (asks.length > 0 && asks[0].price <= price) {
            lastPrice = asks[0].price;
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
            break;
        }
    }
    createTransaction(studentEmail, 'satoshis', -1 * totalSatoshisPaid, 'Bid placed', timestamp);
    let ticketsBought = quantity - ticketsRemaining;
    if (ticketsBought > 0) {
        let description = ticketsBought === quantity ? 'Bid filled' : 'Bid partially filled';
        createTransaction(studentEmail, 'tickets', ticketsBought, description, timestamp);
    }
    totalTicketsExchanged += ticketsBought;
    store.emitChange();
});

store.registerHandler('NEW_ASK', data => {
    let studentEmail = data.studentEmail;
    let quantity = data.quantity;
    let price = data.price;
    let timestamp = data.timestamp;
    let student = students.get(studentEmail);
    if (student === undefined) {
        throw new Error('This student email address is not in use.');
    }
    if (student.balance.tickets < quantity) {
        throw new Error('You do not have enough tickets to place this ask.');
    }
    let totalSatoshisReceived = 0;
    let ticketsRemaining = quantity;
    while (ticketsRemaining > 0) {
        if (bids.length > 0 && bids[0].price >= price) {
            lastPrice = bids[0].price;
            if (bids[0].quantity <= ticketsRemaining) {
                let ticketsExchanged = bids[0].quantity;
                let satoshisPaid = ticketsExchanged * bids[0].price;
                let satoshisReceived = Math.ceil(satoshisPaid * (1 - FEE));
                totalSatoshisReceived += satoshisReceived;
                ticketsRemaining -= ticketsExchanged;
                createTransaction(bids[0].studentEmail, 'tickets', ticketsExchanged, 'Bid filled', timestamp);
                bids.shift();
                totalTicketsExchanged += ticketsExchanged;
            } else {
                let ticketsExchanged = ticketsRemaining;
                let satoshisPaid = ticketsExchanged * bids[0].price;
                let satoshisReceived = Math.ceil(satoshisPaid * (1 - FEE));
                totalSatoshisReceived += satoshisReceived;
                ticketsRemaining -= ticketsExchanged;
                createTransaction(bids[0].studentEmail, 'tickets', ticketsExchanged, 'Bid partially filled', timestamp);
                bids[0].quantity -= ticketsExchanged;
                totalTicketsExchanged += ticketsExchanged;
            }
        } else {
            insertAsk(ticketsRemaining, price, studentEmail);
            break;
        }
    }
    createTransaction(studentEmail, 'tickets', -1 * quantity, 'Ask placed', timestamp);
    if (totalSatoshisReceived > 0) {
        let description = ticketsRemaining === 0 ? 'Ask filled' : 'Ask partially filled';
        createTransaction(studentEmail, 'satoshis', totalSatoshisReceived, description, timestamp);
    }
    store.emitChange();
});

export default store;
