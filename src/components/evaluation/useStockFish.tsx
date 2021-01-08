import React, { useCallback, useEffect, useState } from "react";
import { pairValues, parseOneLineResult } from "../../libs/parseStockfishResults";
import { IEvaluation, LINE_MAP, Undef } from "interfaces";

const collectEngineData = (setEvaluations: React.Dispatch<React.SetStateAction<IEvaluation[]>>, lastFen: string) => {
  const evaluationBuffer = new Map();

  return (msg: MessageEvent) => {
    const data = msg.data;

    if (typeof data === "string" && data.indexOf("multipv") !== -1) {
      const multipv = pairValues("multipv", data);
      const index = Number(multipv);
      const result = parseOneLineResult(data, 4);

      if (result) {
        if (!evaluationBuffer.has(index) || evaluationBuffer.get(index)[LINE_MAP.pv] !== result[LINE_MAP.pv]) {
          evaluationBuffer.set(index, result);
          const newEvaluations = Array.from(evaluationBuffer).map(([i, v]) => v);
          setEvaluations(newEvaluations);
        }
      }
    }
  };
};

export function useStockFishWorker(lastFen: string, movesLine: string, delay: number, multiPv: number): [Undef<Worker>, IEvaluation[], any] {
  const [worker, setWorker] = useState<Worker>();
  const [error, setError] = useState<any>();
  const [evaluations, setEvaluations] = useState<IEvaluation[]>([]);

  const workerDelay = delay * 1000;

  const collector = useCallback(() => {
    const buffer = {};
    return collectEngineData(setEvaluations, lastFen);
  }, [setEvaluations, lastFen]);

  useEffect(() => {

    const path: string = "/engines/";
    const hashSize = 32;
    let instance;
    try {

      if (!window.Worker) {
        throw new Error("Worker is not supported");
      }
      console.log("isWasmSupported()", isWasmSupported());
      instance = new window.Worker(isWasmSupported() ? `${path}stockfish.wasm.js` : `${path}stockfish.js`);

      instance.addEventListener("message", collector());
      instance.postMessage("uci");
      instance.postMessage("isready");
      // instance.postMessage(`setoption name Threads value ${this.config.threads}`); // do not allow this line, then is 100% cpu
      instance.postMessage(`setoption name Hash value ${hashSize}`);
      instance.postMessage(`setoption name UCI_AnalyseMode value false`);
      instance.postMessage("setoption name Ponder value false");
      instance.postMessage(`setoption name Contempt value 24`);
      instance.postMessage(`setoption name multipv value ${multiPv}`);
      setWorker(instance);

    } catch (e) {
      setError(e);
    }

    return () => {
      if (instance) {
        instance.terminate();
      }
    };

  }, [delay, multiPv]);

  useEffect(() => {
    if (worker && lastFen) {
      console.log("New position", { lastFen, movesLine, workerDelay });
      worker.postMessage("stop");
      worker.postMessage(`position fen ${lastFen} moves ${movesLine}`);
      worker.postMessage(`go movetime ${workerDelay}`);
    }

    return function cleanup() {
      if (worker) {
        worker.postMessage("stop");
        // worker.terminate();
        // console.log("worker terminated");
      }
    };
  }, [lastFen, movesLine, worker, workerDelay, multiPv]);
  return [worker, evaluations, error];
}

function isWasmSupported(): boolean {
  return typeof (window as any).WebAssembly === "object" && (window as any).WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
}