import SocketIO from 'socket.io';

import { authenticateStudent } from './authenticate';
import ExchangeStore from '../stores/exchange-store';

let studentsRegistered = ExchangeStore.getRegisteredStudentsCount();
let ticketsExchanged = ExchangeStore.getTicketsExchangedCount();
let lastPrice = ExchangeStore.getLastPrice();
let bids = ExchangeStore.getAnonymizedBids();
let asks = ExchangeStore.getAnonymizedAsks();

export default function(server) {

    const io = SocketIO(server);

    io.on('connection', function(socket){
        socket.emit('update students registered', studentsRegistered);
        socket.emit('update tickets exchanged', ticketsExchanged);
        socket.emit('update last price', lastPrice);
        socket.emit('update bids', bids);
        socket.emit('update asks', asks);
        let onChange;
        let studentEmail;
        let tickets;
        let satoshis;
        let myBids = [];
        let myAsks = [];
        let myTransactions = [];
        socket.on('authenticate', credentials => {
            if (onChange !== undefined) {
                return;
            }
            try {
                authenticateStudent(credentials.studentEmail, credentials.authTokenA, credentials.authTokenB);
                studentEmail = credentials.studentEmail;
                onChange = () => {
                    let student = ExchangeStore.getStudent(studentEmail);
                    if (tickets !== (tickets = student.balance.tickets)) {
                        socket.emit('update tickets', tickets);
                    }
                    if (satoshis !== (satoshis = student.balance.satoshis)) {
                        socket.emit('update satoshis', satoshis);
                    }
                    if (JSON.stringify(myBids) !== JSON.stringify(myBids = ExchangeStore.getStudentsBids(studentEmail))) {
                        socket.emit('update my bids', myBids);
                    }
                    if (JSON.stringify(myAsks) !== JSON.stringify(myAsks = ExchangeStore.getStudentsAsks(studentEmail))) {
                        socket.emit('update my asks', myAsks);
                    }
                    if (JSON.stringify(myTransactions) !== JSON.stringify(myTransactions = ExchangeStore.getStudentsTransactions(studentEmail))) {
                        socket.emit('update my transactions', myTransactions);
                    }
                };
                onChange();
                ExchangeStore.addChangeListener(onChange);
            } catch (e) {
                socket.emit('authentication failed');
            }
        });
        socket.on('disconnect', () => {
            if (onChange !== undefined) {
                ExchangeStore.removeChangeListener(onChange);
            }
        });
    });

    ExchangeStore.addChangeListener(() => {
        if (studentsRegistered !== (studentsRegistered = ExchangeStore.getRegisteredStudentsCount())) {
            io.emit('update students registered', studentsRegistered);
        }
        if (ticketsExchanged !== (ticketsExchanged = ExchangeStore.getTicketsExchangedCount())) {
            io.emit('update tickets exchanged', ticketsExchanged);
        }
        if (lastPrice !== (lastPrice = ExchangeStore.getLastPrice())) {
            io.emit('update last price', lastPrice);
        }
        if (JSON.stringify(bids) !== JSON.stringify(bids = ExchangeStore.getAnonymizedBids())) {
            io.emit('update bids', bids);
        }
        if (JSON.stringify(asks) !== JSON.stringify(asks = ExchangeStore.getAnonymizedAsks())) {
            io.emit('update asks', asks);
        }
    });

}
