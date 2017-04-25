import SocketIO from 'socket.io-client';
import { Dispatcher } from 'consus-core/flux';
import CredentialsStore from '../stores/credentials-store';

export default function() {

    const socket = SocketIO(`${location.protocol}//${location.hostname}`);

    let authenticated = CredentialsStore.isAuthenticated();

    if (authenticated) {
        socket.emit('authenticate', {
            studentEmail: CredentialsStore.getStudentEmail(),
            authTokenA: CredentialsStore.getAuthTokenA(),
            authTokenB: CredentialsStore.getAuthTokenB()
        });
    }

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

    socket.on('update last price', lastPrice => {
        Dispatcher.handleAction('UPDATE_LAST_PRICE', {
            lastPrice
        });
    });

    socket.on('update tickets', tickets => {
        Dispatcher.handleAction('UPDATE_TICKETS', {
            tickets
        });
    });

    socket.on('update satoshis', satoshis => {
        Dispatcher.handleAction('UPDATE_SATOSHIS', {
            satoshis
        });
    });

    socket.on('update bids', bids => {
        Dispatcher.handleAction('UPDATE_BIDS', {
            bids
        });
    });

    socket.on('update asks', asks => {
        Dispatcher.handleAction('UPDATE_ASKS', {
            asks
        });
    });

}
