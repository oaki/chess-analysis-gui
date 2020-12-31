// const openingTable = {};
// let bookLoaded = false;
//
// export async function getOpening() {
//     if (bookLoaded) {
//         return openingTable;
//     }
//     const response = await require("../public/books/book.bin");
//     const buffer = await response.arrayBuffer();
//     addBook(buffer);
//
//     bookLoaded = true;
//     return openingTable;
// }
//
// function unsignedHexString(number) {
//     if (number < 0) {
//         number = 0xFFFFFFFF + number + 1;
//     }
//
//     return number.toString(16).toUpperCase();
// }
//
// function addBook(book) {
//     const bookDataView = new DataView(book);
//
//     for (let byteOffset = 0; byteOffset < bookDataView.byteLength - 8; byteOffset += 8) {
//         const key = unsignedHexString(bookDataView.getUint32(byteOffset)) + unsignedHexString(bookDataView.getUint32(byteOffset + 4));
//         const move = bookDataView.getUint16(byteOffset + 8);
//         // const weight = bookDataView.getUint16(byteOffset + 10);
//         // const learn = bookDataView.getUint32(byteOffset + 12);
//
//         if (!openingTable[key]) {
//             openingTable[key] = [];
//         }
//
//         openingTable[key].push(move);
//     }
// }
