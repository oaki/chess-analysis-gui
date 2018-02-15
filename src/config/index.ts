const isDev = process.argv.indexOf('env=dev') !== -1;
console.log('process',process);
let config = {
    host: 'https://chess-analysis.com'
};
if (isDev) {
    config.host = 'localhost';
}
config.host = 'localhost:8080';

export default config;