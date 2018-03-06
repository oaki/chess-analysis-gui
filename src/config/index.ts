const isDev = process.argv.indexOf('env=dev') !== -1;

console.log('isDev', isDev);
console.log('process', process);
console.log('process.env.NODE_ENV', process.env.NODE_ENV );
console.log('process.env.REACT_APP_PORT', process.env.REACT_APP_PORT );
let config = {
    socketIo: {
        host: 'https://api.chess-analysis.com',
        path: '/socket.io',
    }
};
if (process.env.NODE_ENV === 'development') {
    config.socketIo = {
        host: 'localhost:8080',
        path: '/socket.io',
    }
}


export default config;