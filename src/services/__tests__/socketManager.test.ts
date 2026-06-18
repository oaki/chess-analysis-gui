const dispatchMock = jest.fn();
const getStateMock = jest.fn(() => ({ fen: "fen-current" }));
const emitMock = jest.fn();
const onMock = jest.fn();

jest.mock("../sockets/actions", () => ({
  socketConnect: jest.fn((isConnected = true) => ({
    type: "IS_CONNECTED",
    payload: { isConnected },
  })),
}));

jest.mock("socket.io-client", () => ({
  io: jest.fn(() => ({
    on: onMock,
    emit: emitMock,
  })),
}));

jest.mock("../../store", () => ({
  __esModule: true,
  store: {
    dispatch: dispatchMock,
    getState: getStateMock,
  },
  useAppStore: jest.fn(),
}));

jest.mock("../errorManager", () => ({
  Flash: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../components/moveTree/tree", () => ({
  NODE_MAP: { evaluation: "e" },
  treeService: {
    findReferencesByFen: jest.fn(() => [{ e: [] }]),
  },
}));

jest.mock("../evaluationPipeline", () => ({
  parseWorkerEvaluation: jest.fn(),
  shouldUseLocalEvaluation: jest.fn(),
  withReducedNodes: jest.fn((fen, evaluation) => ({ ...evaluation, fen })),
}));

import { SocketManager } from "../socketManager";
import { io } from "socket.io-client";
import { parseWorkerEvaluation, shouldUseLocalEvaluation } from "../evaluationPipeline";

describe("SocketManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("wires socket handlers and dispatches connect/disconnect actions", () => {
    const manager = new SocketManager({ socketIo: { host: "ws://host", path: "/socket" } });
    manager.setSignInToken("abc");
    manager.connect();

    expect(io).toHaveBeenCalled();
    expect(onMock).toHaveBeenCalledWith("connect", expect.any(Function));
    expect(onMock).toHaveBeenCalledWith("disconnect", expect.any(Function));
    expect(onMock).toHaveBeenCalledWith("workerEvaluation", manager.handleResult);
    expect(onMock).toHaveBeenCalledWith("syzygyEvaluation", manager.handleSyzygyResult);
    expect(onMock).toHaveBeenCalledWith("noWorkerAvailable", manager.handleOfflineWorker);
  });

  it("dispatches evaluation when worker result is valid", () => {
    const manager = new SocketManager({ socketIo: { host: "ws://host", path: "/socket" } });
    (parseWorkerEvaluation as jest.Mock).mockReturnValue({
      fen: "fen-current",
      results: [{ score: "0.3" }],
    });

    manager.handleResult("payload");

    expect(parseWorkerEvaluation).toHaveBeenCalledWith("payload", "fen-current");
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SET_EVALUATION",
      })
    );
  });

  it("emits setNewPosition when local evaluation is not enough", () => {
    const manager = new SocketManager({ socketIo: { host: "ws://host", path: "/socket" } });
    (shouldUseLocalEvaluation as jest.Mock).mockReturnValue(false);

    manager.connect();
    manager.setNewPosition("fen-next", "e2e4", true, null, null);

    expect(emitMock).toHaveBeenCalledWith(
      "setNewPosition",
      expect.objectContaining({
        FEN: "fen-next",
        move: "e2e4",
      })
    );
  });

  it("dispatches local cached evaluation when sufficient", () => {
    const manager = new SocketManager({ socketIo: { host: "ws://host", path: "/socket" } });
    (shouldUseLocalEvaluation as jest.Mock).mockReturnValue(true);

    manager.setNewPosition("fen-local", "e2e4", true, null, { nodes: 5000 } as any);

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SET_EVALUATION",
      })
    );
  });

  it("uses offline worker interface when not online", () => {
    const manager = new SocketManager({ socketIo: { host: "ws://host", path: "/socket" } });
    (manager as any).stockfishEngineInterface = { go: jest.fn() };

    manager.setNewPosition("fen-offline", "e2e4", false, null, null);

    expect((manager as any).stockfishEngineInterface.go).toHaveBeenCalledWith("fen-offline");
  });
});
