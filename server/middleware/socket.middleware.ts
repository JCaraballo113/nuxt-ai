import { Socket, Server } from 'socket.io';

let appSocket = {
    emit: (channel: string, message: string) => {
        console.log(`Not initiated yet ${channel} ${message}`);
    },
};

export default defineEventHandler(async (event) => {
    event.context.appSocket = appSocket;
    // @ts-expect-error
    if (global.io) return;

    console.log('Initializing socket.io');
    const node = event.node;

    // @ts-expect-error
    global.io = new Server(node.res.socket?.server);

    // @ts-expect-error
    global.io.on('connection', (socket: Socket) => {
        socket.emit('message-channel', `welcome ${socket.id}`);

        appSocket.emit = (channel, message) => {
            // @ts-expect-error
            global.io.emit(channel, message);
        };

        socket.on('message', (data) => {
            console.log('Relaying again for funsies: ', data);
            // @ts-expect-error
            global.io.emit('message-channel', 'Hello, client! ' + data);
        });

        socket.on('disconnect', () => {
            // Put optional disconnect logic here
        });
    });
    return 'Hello Nitro';
});
