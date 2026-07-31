import { countPieces } from "../countPieces";

describe("countPieces", () => {
  it("counts all pieces in starting position", () => {
    expect(countPieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toBe(32);
  });

  it("counts only remaining pieces", () => {
    // 3R4/6k1/5pP1/8/7P/8/r4PK1/8 b - h3 0 36
    expect(countPieces("3R4/6k1/5pP1/8/7P/8/r4PK1/8 b - h3 0 36")).toBe(8);
  });

  it("returns 2 for kings only", () => {
    expect(countPieces("8/8/8/8/8/8/8/K6k w - - 0 1")).toBe(2);
  });

  it("returns 0 for empty board", () => {
    expect(countPieces("8/8/8/8/8/8/8/8 w - - 0 1")).toBe(0);
  });
});
