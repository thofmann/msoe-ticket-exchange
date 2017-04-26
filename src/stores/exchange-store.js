import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';
import { studentIdToBitcoinAddress } from '../lib/bitcoin';

const FEE = 0.05;

let students = new Map();
let nextStudentId = 0;
let bids = []; // descending bid price
let asks = []; // ascending ask price
let totalTicketsExchanged = 0;
let lastPrice;
let nextBidId = 0;
let nextAskId = 0;
let announcements = []; // descending by timestamp
let nextAnnouncementId = 0;
let payments = [];

function getStudentByBackupEmail(backupEmail) {
    for (let student of students.values()) {
        if (student.backupEmail === backupEmail) {
            return student;
        }
    }
}

function getStudentById(studentId) {
    for (let student of students.values()) {
        if (student.id === studentId) {
            return student;
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

    getAnnouncements() {
        return clone(announcements);
    }

    getPayments() {
        return clone(payments);
    }

    getStudent(studentEmail) {
        return clone(students.get(studentEmail));
    }

    getStudentByBackupEmail(backupEmail) {
        return clone(getStudentByBackupEmail(backupEmail));
    }

    getBids(count = Infinity) {
        return clone(bids.slice(0, count));
    }

    getAsks(count = Infinity) {
        return clone(asks.slice(0, count));
    }

    getStudentsBids(studentEmail) {
        return bids.filter(bid => bid.studentEmail === studentEmail).map(bid => {
            return {
                id: bid.id,
                quantity: bid.quantity,
                price: bid.price
            };
        });
    }

    getStudentsAsks(studentEmail) {
        return asks.filter(ask => ask.studentEmail === studentEmail).map(ask => {
            return {
                id: ask.id,
                quantity: ask.quantity,
                price: ask.price
            };
        });
    }

    getStudentsTransactions(studentEmail) {
        return clone(students.get(studentEmail).transactions);
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
        id: nextStudentId,
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
            tickets: 0,
            satoshis: 0
        },
        transactions: [], // descending by timestamp
        bitcoinDepositAddress: studentIdToBitcoinAddress(nextStudentId)
    });
    nextStudentId++;
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

store.registerHandler('CANCEL_BID', data => {
    let studentEmail = data.studentEmail;
    let id = data.id;
    let timestamp = data.timestamp;
    let index = bids.findIndex(bid => bid.id === id);
    if (index === -1) {
        throw new Error('This bid could not be found.');
    }
    let bid = bids[index];
    if (bid.studentEmail !== studentEmail) {
        throw new Error('This is not your bid.');
    }
    createTransaction(studentEmail, 'satoshis', bid.quantity * bid.price, 'Bid cancelled', timestamp);
    bids.splice(index, 1);
    store.emitChange();
});

store.registerHandler('CANCEL_ASK', data => {
    let studentEmail = data.studentEmail;
    let id = data.id;
    let timestamp = data.timestamp;
    let index = asks.findIndex(ask => ask.id === id);
    if (index === -1) {
        throw new Error('This ask could not be found.');
    }
    let ask = asks[index];
    if (ask.studentEmail !== studentEmail) {
        throw new Error('This is not your ask.');
    }
    createTransaction(studentEmail, 'tickets', ask.quantity, 'Ask cancelled', timestamp);
    asks.splice(index, 1);
    store.emitChange();
});

store.registerHandler('DEPOSIT_TICKETS', data => {
    let recipientStudentEmail = data.recipientStudentEmail;
    let quantity = data.quantity;
    let timestamp = data.timestamp;
    let student = students.get(recipientStudentEmail);
    if (student === undefined) {
        throw new Error('This student email address is not in use.');
    }
    createTransaction(recipientStudentEmail, 'tickets', quantity, 'Tickets deposited', timestamp);
    store.emitChange();
});

store.registerHandler('MAKE_ANNOUNCEMENT', data => {
    announcements.unshift({
        title: data.title,
        text: data.text,
        timestamp: data.timestamp,
        id: nextAnnouncementId
    });
    nextAnnouncementId++;
    store.emitChange();
});

store.registerHandler('UPDATE_PAYMENTS', data => {
    if (data.payments.length <= payments.length) {
        return;
    }
    let newPayments = data.payments.slice(payments.length);
    newPayments.forEach(payment => {
        createTransaction(getStudentById(payment.studentId).studentEmail, 'satoshis', payment.satoshis, 'Bitcoins deposited', data.timestamp);
    });
    payments = clone(payments.concat(newPayments));
    store.emitChange();
});

export default store;
