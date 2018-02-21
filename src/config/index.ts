const isDev = process.argv.indexOf('env=dev') !== -1;
console.log('process',process);
let config = {
    socketIoHost: 'https://chess-analysis.com/api/'
};
if (isDev) {
    config.socketIoHost = 'localhost:8080';
}


export default config;