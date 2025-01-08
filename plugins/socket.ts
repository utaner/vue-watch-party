import io from 'socket.io-client';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            socket: io('http://localhost:3002')
        }
    }
});