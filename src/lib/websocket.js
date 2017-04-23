import SocketIO from 'socket.io';

import ExchangeStore from '../stores/exchange-store';

let studentsRegistered = ExchangeStore.getRegisteredStudentsCount();

export default function(server) {

    const io = SocketIO(server);

    io.on('connection', function(socket){
        socket.emit('update students registered', studentsRegistered);
    });

    ExchangeStore.addChangeListener(() => {
        let newStudentsRegistered = ExchangeStore.getRegisteredStudentsCount();
        if (newStudentsRegistered !== studentsRegistered) {
            studentsRegistered = newStudentsRegistered;
            io.emit('update students registered', studentsRegistered);
        }
    });

}
