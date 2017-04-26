import SocketIO from 'socket.io-client';
import Cookies from 'js-cookie';
import { Dispatcher } from 'consus-core/flux';
import CredentialsStore from '../stores/credentials-store';
import { history } from '../views/app.jsx';

export default function() {

    const socket = SocketIO(`${location.protocol}//${location.hostname}`);

    function authenticate() {
        socket.emit('authenticate', {
            studentEmail: CredentialsStore.getStudentEmail(),
            authTokenA: CredentialsStore.getAuthTokenA(),
            authTokenB: CredentialsStore.getAuthTokenB()
        });
    }

    if (CredentialsStore.isAuthenticated()) {
        authenticate();
    } else {
        let onChange = () => {
            if (CredentialsStore.isAuthenticated()) {
                authenticate();
            }
            CredentialsStore.removeChangeListener(onChange);
        };
        CredentialsStore.addChangeListener(onChange);
    }

    socket.on('authentication failed', () => {
        Cookies.remove('studentEmail');
        Cookies.remove('authTokenA');
        Cookies.remove('authTokenB');
        Dispatcher.handleAction('LOGOUT');
        history.push('/');
    });

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

    socket.on('update announcements', announcements => {
        Dispatcher.handleAction('UPDATE_ANNOUNCEMENTS', {
            announcements
        });
    });

    socket.on('update my bids', myBids => {
        Dispatcher.handleAction('UPDATE_MY_BIDS', {
            myBids
        });
    });

    socket.on('update my asks', myAsks => {
        Dispatcher.handleAction('UPDATE_MY_ASKS', {
            myAsks
        });
    });

    socket.on('update my transactions', myTransactions => {
        Dispatcher.handleAction('UPDATE_MY_TRANSACTIONS', {
            myTransactions
        });
    });

    socket.on('update bitcoin deposit address', bitcoinDepositAddress => {
        Dispatcher.handleAction('UPDATE_BITCOIN_DEPOSIT_ADDRESS', {
            bitcoinDepositAddress
        });
    });

}
