import React, {useEffect, useState} from "react";
import {pairValues, parseResult} from "../../libs/parseStockfishResults";
import {useInterval} from "../hooks/useInterval";
import {IEvaluation, Undef} from "interfaces";

let engineMsgBuffer = {};

function collectEngineData(msg: MessageEvent) {
    const multipv = pairValues("multipv", msg.data);
    engineMsgBuffer[multipv] = msg.data;
}

export function useStockFishWorker(lastFen: string, movesLine: string): [Undef<Worker>, IEvaluation[], any] {
    const [worker, setWorker] = useState<Worker>();
    const [error, setError] = useState<any>();
    const [evaluations, setEvaluations] = useState<IEvaluation[]>([]);
    const [workerConfig, setWorkerConfig] = useState({
        threads: 1,
        delay: 10 * 1000,
        hashSize: 32,
        multiPv: 3
    });

    useInterval(() => {
        console.log("Time", performance.now() / 1000);
        const values = Object.keys(engineMsgBuffer).map((key) => (engineMsgBuffer[key]));
        console.log({values});
        const evaluationStringFromEngine = values.join("\n");

        // const data = JSON.stringify(evaluationStringFromEngine);
        const result = parseResult(evaluationStringFromEngine, lastFen);

        if (result.length > 0) {
            setEvaluations(result);
        }
    }, 3000);

    // const onResultCallback = useCallback((msg: MessageEvent) => {
    //     engineMsgBuffer.push(msg.data);
    //     debounceMsg(lastFen, setEvaluations);
    // }, [lastFen, setEvaluations]);

    useEffect(() => {
        if (!worker) {
            const path: string = "/engines/";
            try {

                if (!window.Worker) {
                    throw new Error("Worker is not supported");
                }
                const instance = new window.Worker(isWasmSupported() ? `${path}stockfish.wasm.js` : `${path}stockfish.js`);

                instance.addEventListener("message", collectEngineData);
                instance.postMessage("uci");
                instance.postMessage("isready");
                // instance.postMessage(`setoption name Threads value ${this.config.threads}`); // do not allow this line, then is 100% cpu
                instance.postMessage(`setoption name Hash value ${workerConfig.hashSize}`);
                instance.postMessage(`setoption name UCI_AnalyseMode value false`);
                instance.postMessage("setoption name Ponder value false");
                instance.postMessage(`setoption name multipv value ${workerConfig.multiPv}`);
                instance.postMessage(`setoption name Contempt value 24`);

                setWorker(instance);
            } catch (e) {
                setError(e);
            }
        }
    }, [collectEngineData, worker, workerConfig.hashSize, workerConfig.multiPv]);

    useEffect(() => {
        if (worker && lastFen) {
            worker.postMessage("stop");
            worker.postMessage(`position fen ${lastFen} moves ${movesLine}`);
            worker.postMessage(`go movetime ${workerConfig.delay}`);
        }

        return function cleanup() {
            if (worker) {
                worker.postMessage("stop");
                worker.terminate();
                console.log("worker terminated");
            }
        };
    }, [lastFen, movesLine, worker, workerConfig]);
    return [worker, evaluations, error];
}

function isWasmSupported(): boolean {
    return typeof (window as any).WebAssembly === "object" && (window as any).WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
}