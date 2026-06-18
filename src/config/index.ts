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
const env = process.env as NodeJS.ProcessEnv;

export const config = {
    apiHost: env.REACT_APP_HOST as string,
    socketIo: {
        host: env.REACT_APP_SOCKET_IO_HOST as string,
        path: env.REACT_APP_SOCKET_IO_PATH as string,
    },
    google: {
        clientId: env.REACT_APP_GOOGLECLIENTID as string
    }
};

export type AppConfig = {
    apiHost: string;
    socketIo: {
        host: string;
        path: string;
    };
    google: {
        clientId: string;
    };
};