// import {unsignedHexString} from "./libs/polyglot";

export default class Opening {

    private openingTable;
    private bookLoaded = false;

    constructor() {
        this.openingTable = {};

        this.loadBook();
    }

    async loadBook() {

        // function syncGETBuffer(path) {
        //     // Synchronous HTTP request
        //     var request = new XMLHttpRequest();
        //     request.open('GET', path, false);
        //     request.responseType = 'arraybuffer';
        //     request.send(null);
        //
        //     if (request.status === 200) {
        //         return request.response;
        //     }
        // }

        const path = '/books/book.bin';
        // const path = '/books/gm2001.bin';
        const response = await fetch(path);
        const buffer = await response.arrayBuffer();
        this.addBook(buffer);

    }


    addBook(book) {
        const bookDataView = new DataView(book);

        for (let byteOffset = 0; byteOffset < bookDataView.byteLength - 8; byteOffset += 8) {
            const key = this.unsignedHexString(bookDataView.getUint32(byteOffset)) + this.unsignedHexString(bookDataView.getUint32(byteOffset + 4));
            const move = bookDataView.getUint16(byteOffset + 8);
            // const weight = bookDataView.getUint16(byteOffset + 10);
            // const learn = bookDataView.getUint32(byteOffset + 12);

            if (!this.openingTable[key]) {
                this.openingTable[key] = [];
            }

            this.openingTable[key].push(move);
        }

        this.bookLoaded = true;
    }

    isbookLoaded() {
        return this.bookLoaded;
    }


    unsignedHexString(number) {
        if (number < 0) {
            number = 0xFFFFFFFF + number + 1;
        }

        return number.toString(16).toUpperCase();
    }
};