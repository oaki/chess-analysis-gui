// require('dotenv').config({path: './../.env'});


// let config = {
//     apiHost: 'https://api.chess-analysis.com',
//     socketIo: {
//         host: 'https://api.chess-analysis.com',
//         path: '/socket.io',
//     }
// // };
// if (process.env.NODE_ENV === 'development') {
//     config.socketIo = {
//         host: 'localhost:8080',
//         path: '/socket.io',
//     }
// }
const env: any = process.env;
console.log('env',env);
const config: IConfig = {
    apiHost: env.REACT_APP_HOST,
    socketIo: {
        host: env.REACT_APP_SOCKET_IO_HOST,
        path: env.REACT_APP_SOCKET_IO_PATH,
    },
    google: {
        clientId: env.REACT_APP_GOOGLECLIENTID
    }
};

interface IConfig {
    apiHost: string;
    socketIo: {
        host: string;
        path: string;
    };
    google: {
        clientId: string;
    }
}

export default config;