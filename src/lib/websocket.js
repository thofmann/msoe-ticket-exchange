import SocketIO from 'socket.io';

let studentsRegistered = 0;

export default function(server) {

    const io = SocketIO(server);

    setInterval(() => {
        studentsRegistered++;
        io.emit('update students registered', studentsRegistered);
    }, 1000);

}
