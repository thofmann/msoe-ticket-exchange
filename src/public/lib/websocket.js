import SocketIO from 'socket.io-client';
import { Dispatcher } from 'consus-core/flux';

export default function() {

    const socket = SocketIO(`${location.protocol}//${location.hostname}`);

    socket.on('update students registered', studentsRegistered => {
        Dispatcher.handleAction('UPDATE_STUDENTS_REGISTERED', {
            studentsRegistered
        });
    });

    socket.on('update tickets exchanged', ticketsExchanged => {
        Dispatcher.handleAction('UPDATE_TICKETS_EXCHANGED', {
            ticketsExchanged
        });
    });

}
