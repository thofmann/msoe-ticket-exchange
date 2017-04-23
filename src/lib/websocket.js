import SocketIO from 'socket.io';

import ExchangeStore from '../stores/exchange-store';

let studentsRegistered = ExchangeStore.getRegisteredStudentsCount();
let ticketsExchanged = ExchangeStore.getTicketsExchangedCount();

export default function(server) {

    const io = SocketIO(server);

    io.on('connection', function(socket){
        socket.emit('update students registered', studentsRegistered);
        socket.emit('update tickets exchanged', ticketsExchanged);
    });

    ExchangeStore.addChangeListener(() => {
        if (studentsRegistered !== (studentsRegistered = ExchangeStore.getRegisteredStudentsCount())) {
            io.emit('update students registered', studentsRegistered);
        }
        if (ticketsExchanged !== (ticketsExchanged = ExchangeStore.getTicketsExchangedCount())) {
            io.emit('update tickets exchanged', ticketsExchanged);
        }
    });

}
