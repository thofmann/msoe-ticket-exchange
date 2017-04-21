import SocketIO from 'socket.io-client';
import { Dispatcher } from 'consus-core/flux';
import config from '../../config.json';

const socket = SocketIO(`${config.server.protocol}://${config.server.domain}`);

socket.on('update students registered', studentsRegistered => {
    Dispatcher.handleAction('UPDATE_STUDENTS_REGISTERED', {
        studentsRegistered
    });
});
