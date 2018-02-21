const isDev = process.argv.indexOf('env=dev') !== -1;
console.log('process', process);
let config = {
    socketIo: {
        host: 'https://chess-analysis.com/',
        path: '/api/socket.io',
    }
};
if (isDev) {
    config.socketIo = {
        host: 'localhost:8080',
        path: '/socket.io',
    }
}


export default config;