const isDev = process.argv.indexOf('env=dev') !== -1;
console.log('process', process);
let config = {
    socketIo: {
        host: 'https://api.chess-analysis.com',
        path: '/socket.io',
    }
};
if (isDev) {
    config.socketIo = {
        host: 'localhost:8080',
        path: '/socket.io',
    }
}


export default config;