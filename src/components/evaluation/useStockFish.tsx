import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {parseResult} from "../../libs/parseStockfishResults";


export function useStockFishWorker(lastFen: string, movesLine: string) {
    const [worker, setWorker] = useState();
    const [error, setError] = useState();
    const [evaluation, setEvaluation] = useState();
    const [workerConfig, setWorkerConfig] = useState({
        threads: 1,
        delay: 120 * 1000,
        hashSize: 32,
        multiPv: 1
    });

    const onResultCallback = useCallback((msg: MessageEvent) => {


        const data = JSON.stringify(msg.data);
        console.log({msg, data});
        const result = parseResult(data, lastFen);

        if (result) {
            console.log({result});
            setEvaluation(evaluation);
        }

    }, [lastFen]);

    useEffect(() => {
        if (!worker) {
            const path: string = "/engines/";
            const instance = new Worker(isWasmSupported() ? `${path}stockfish.wasm.js` : `${path}stockfish.js`);

            instance.addEventListener("message", onResultCallback);
            instance.postMessage("uci");
            instance.postMessage("isready");
            // instance.postMessage(`setoption name Threads value ${this.config.threads}`); // do not allow this line, then is 100% cpu
            instance.postMessage(`setoption name Hash value ${workerConfig.hashSize}`);
            instance.postMessage(`setoption name UCI_AnalyseMode value false`);
            instance.postMessage("setoption name ownbook value false");
            instance.postMessage("setoption name Ponder value false");
            instance.postMessage(`setoption name multipv value ${workerConfig.multiPv}`);

            setWorker(instance);
        }
    }, []);

    useEffect(() => {
        if (worker && lastFen) {
            worker.postMessage("stop");
            worker.postMessage(`position fen ${lastFen} moves ${movesLine}`);
            worker.postMessage(`go movetime ${workerConfig.delay}`);

        }
    }, [lastFen, movesLine, worker, workerConfig]);
    return [worker, evaluation];
}

function isWasmSupported(): boolean {
    return typeof (window as any).WebAssembly === "object" && (window as any).WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
}