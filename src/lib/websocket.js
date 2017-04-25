import SocketIO from 'socket.io';

import { authenticateStudent } from './authenticate';
import ExchangeStore from '../stores/exchange-store';

let studentsRegistered = ExchangeStore.getRegisteredStudentsCount();
let ticketsExchanged = ExchangeStore.getTicketsExchangedCount();
let lastPrice = ExchangeStore.getLastPrice();

export default function(server) {

    const io = SocketIO(server);

    io.on('connection', function(socket){
        socket.emit('update students registered', studentsRegistered);
        socket.emit('update tickets exchanged', ticketsExchanged);
        io.emit('update last price', lastPrice);
        let onChange;
        let studentEmail;
        let tickets;
        let satoshis;
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
    });

}
