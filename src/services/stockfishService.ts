class StockfishEngineInterface {
    private config = {
        threads: 1,
        delay: 120 * 1000,
        hashSize: 32,
        multiPv: 1
    }

    private instance: any;
    private lastFen: string = '';
    private onResultCallback: (data: string, fen: string) => void = ()=>{};
    private isInicialized = false;

    isInit() {
        return this.isInicialized;
    }

    init() {
        const wasmSupported = typeof (window as any).WebAssembly === "object" && (window as any).WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
        const path: string = "/engines/";
        this.instance = new Worker(wasmSupported ? `${path}stockfish.wasm.js` : `${path}stockfish.js`);

        this.instance.addEventListener("message", (e) => {
            this.onResultCallback(e.data, this.lastFen);
        });

        this.send("uci");
        this.send("isready");
        // this.send(`setoption name Threads value ${this.config.threads}`); // do not allow this line, then is 100% cpu
        this.send(`setoption name Hash value ${this.config.hashSize}`);
        this.send(`setoption name UCI_AnalyseMode value false`);
        this.send("setoption name ownbook value false");
        this.send("setoption name Ponder value false");
        this.send(`setoption name multipv value ${this.config.multiPv}`);
        this.stop();

        this.isInicialized = true;

    }

    send(msg: string) {
        console.log("postMessage->", msg);
        this.instance.postMessage(msg);
    }

    onResult(callback) {
        this.onResultCallback = callback;
    }


    setPosition(fen: string) {
        this.lastFen = fen;
        this.send(`position fen ${fen}`);
    }

    go(fen: string) {
        this.stop();
        this.setPosition(fen);
        this.send(`go movetime ${this.config.delay}`);
        // this.send(`d`);
    }

    stop() {
        this.send("stop");
    }

}

export const StockfishService = new StockfishEngineInterface();