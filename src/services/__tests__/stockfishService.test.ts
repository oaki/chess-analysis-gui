import { StockfishService } from "../stockfishService";

describe("StockfishService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (StockfishService as any).isInicialized = false;
  });

  it("throws when Worker is not supported", () => {
    const originalWorker = window.Worker;
    Object.defineProperty(window, "Worker", {
      value: undefined,
      writable: true,
    });

    expect(() => StockfishService.init()).toThrow("Worker is not supported");

    Object.defineProperty(window, "Worker", {
      value: originalWorker,
      writable: true,
    });
  });

  it("initializes worker and sends boot commands", () => {
    const postMessage = jest.fn();
    const addEventListener = jest.fn();
    const workerFactory = jest.fn(() => ({
      postMessage,
      addEventListener,
    }));

    Object.defineProperty(window, "Worker", {
      value: workerFactory,
      writable: true,
    });

    (window as any).WebAssembly = {
      validate: jest.fn(() => true),
    };

    StockfishService.init();

    expect(workerFactory).toHaveBeenCalledWith("/engines/stockfish.wasm.js");
    expect(addEventListener).toHaveBeenCalledWith("message", expect.any(Function));
    expect(postMessage).toHaveBeenCalledWith("uci");
    expect(postMessage).toHaveBeenCalledWith("isready");
    expect(postMessage).toHaveBeenCalledWith("stop");
    expect(StockfishService.isInit()).toBe(true);
  });

  it("go stops first then sets position and movetime", () => {
    const sendSpy = jest.spyOn(StockfishService as any, "send").mockImplementation(() => {});

    StockfishService.go("fen-1");

    expect(sendSpy).toHaveBeenNthCalledWith(1, "stop");
    expect(sendSpy).toHaveBeenNthCalledWith(2, "position fen fen-1");
    expect(sendSpy).toHaveBeenNthCalledWith(3, "go movetime 120000");
  });
});
