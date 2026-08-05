import React from "react";
import { render } from "@testing-library/react";
import { useStockFishWorker } from "../useStockFish";

jest.mock("../../../libs/parseStockfishResults", () => ({
  pairValues: jest.fn(() => "1"),
  parseOneLineResult: jest.fn(() => ({ p: "e2e4", s: "0.1" })),
}));

const instances: any[] = [];

class WorkerMock {
  postMessage = jest.fn();
  addEventListener = jest.fn();
  terminate = jest.fn();
  constructor() {
    instances.push(this);
  }
}

function Probe(props: { fen: string; movesLine: string; delay: number; multiPv: number }) {
  useStockFishWorker(props.fen, props.movesLine, props.delay, props.multiPv);
  return <div>ok</div>;
}

describe("useStockFishWorker", () => {
  beforeEach(() => {
    instances.length = 0;
    Object.defineProperty(window, "Worker", {
      writable: true,
      value: WorkerMock,
    });
    (window as any).WebAssembly = { validate: jest.fn(() => true) };
  });

  it("initializes worker and posts engine setup commands", () => {
    render(<Probe fen="fen-1" movesLine="e2e4" delay={3} multiPv={2} />);
    const worker = instances[0];
    expect(worker).toBeDefined();
    expect(worker.postMessage).toHaveBeenCalledWith("uci");
    expect(worker.postMessage).toHaveBeenCalledWith("isready");
    expect(worker.postMessage).toHaveBeenCalledWith("setoption name multipv value 2");
  });

  it("sends new position commands when fen is provided", () => {
    render(<Probe fen="fen-2" movesLine="e2e4 e7e5" delay={5} multiPv={1} />);
    const worker = instances[0];
    expect(worker.postMessage).toHaveBeenCalledWith("stop");
    expect(worker.postMessage).toHaveBeenCalledWith("position fen fen-2 moves e2e4 e7e5");
    expect(worker.postMessage).toHaveBeenCalledWith("go movetime 5000");
  });
});
