// const BookWorker = require("worker-loader?name=openingBookWorker.js!../workers/openingBookWorker");
// const bookWorker = new BookWorker;
//
// let book;
// export const find = (fen) => {
//     const promise = new Promise((resolve) => {
//         bookWorker.postMessage({fen, action: 'find'});
//         bookWorker.onmessage = function (event) {
//             book = event.data;
//             resolve(book);
//         }
//
//     });
//
//     return promise;
// }
//
