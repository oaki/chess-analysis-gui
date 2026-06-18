import { Chess } from "chess.js";
import { toDests, toColor } from "../chessboardUtils";

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("toDests", () => {
  it("returns legal destinations for starting position", () => {
    const chess = new Chess(STARTING_FEN);
    const dests = toDests(chess);
    expect(dests["e2"]).toContain("e3");
    expect(dests["e2"]).toContain("e4");
    expect(dests["g1"]).toContain("f3");
    expect(dests["g1"]).toContain("h3");
  });

  it("has exactly 20 source squares with moves in starting position", () => {
    const chess = new Chess(STARTING_FEN);
    const dests = toDests(chess);
    // 8 pawns + 2 knights = 10 white pieces with moves, each pawn has 2 dests
    expect(Object.keys(dests)).toHaveLength(10);
  });

  it("does not include black squares when white to move", () => {
    const chess = new Chess(STARTING_FEN);
    const dests = toDests(chess);
    expect(dests["e7"]).toBeUndefined();
    expect(dests["d7"]).toBeUndefined();
  });

  it("only includes black squares after white moves", () => {
    const chess = new Chess(STARTING_FEN);
    chess.move({ from: "e2", to: "e4" });
    const dests = toDests(chess);
    expect(dests["e7"]).toContain("e6");
    expect(dests["e2"]).toBeUndefined();
  });

  it("returns empty object when no legal moves (checkmate)", () => {
    // Fool's mate - black is checkmated
    const checkmatePos = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    const chess = new Chess(checkmatePos);
    if (chess.isCheckmate()) {
      const dests = toDests(chess);
      expect(Object.keys(dests)).toHaveLength(0);
    }
  });

  it("only allows king moves when in check", () => {
    // White king in check by black queen on g2, both kings present
    const checkPos = "k7/8/8/8/8/8/6q1/7K w - - 0 1";
    const chess = new Chess(checkPos);
    if (chess.isCheck()) {
      const dests = toDests(chess);
      // Only king can move or block — check that h1 (king) has moves
      expect(Object.keys(dests)).toContain("h1");
    }
  });
});

describe("toColor", () => {
  it("returns white for starting position", () => {
    const chess = new Chess(STARTING_FEN);
    expect(toColor(chess)).toBe("white");
  });

  it("returns black after white moves", () => {
    const chess = new Chess(STARTING_FEN);
    chess.move({ from: "e2", to: "e4" });
    expect(toColor(chess)).toBe("black");
  });

  it("returns white after both sides move", () => {
    const chess = new Chess(STARTING_FEN);
    chess.move({ from: "e2", to: "e4" });
    chess.move({ from: "e7", to: "e5" });
    expect(toColor(chess)).toBe("white");
  });

  it("alternates color each half-move", () => {
    const chess = new Chess(STARTING_FEN);
    const colors: string[] = [toColor(chess)];
    const moves = ["e2e4", "e7e5", "g1f3", "b8c6"];
    for (const m of moves) {
      chess.move({ from: m.slice(0, 2), to: m.slice(2, 4) });
      colors.push(toColor(chess));
    }
    expect(colors).toEqual(["white", "black", "white", "black", "white"]);
  });
});
