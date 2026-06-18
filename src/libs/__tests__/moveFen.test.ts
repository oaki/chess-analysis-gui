import { getMoveFen } from "../moveFen";

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("getMoveFen", () => {
  it("returns correct FEN after e2-e4", () => {
    const result = getMoveFen(STARTING_FEN, "e2e4");
    expect(result.fen).toContain("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR");
    expect(result.from).toBe("e2");
    expect(result.to).toBe("e4");
    expect(result.promotion).toBeUndefined();
  });

  it("returns correct from/to for d-pawn move", () => {
    const result = getMoveFen(STARTING_FEN, "d2d4");
    expect(result.from).toBe("d2");
    expect(result.to).toBe("d4");
  });

  it("handles pawn promotion to queen", () => {
    const prePromotionFen = "8/4P3/8/8/8/8/8/k6K w - - 0 1";
    const result = getMoveFen(prePromotionFen, "e7e8q");
    expect(result.fen).toContain("Q");
    expect(result.promotion).toBe("q");
  });

  it("handles pawn promotion to knight", () => {
    const prePromotionFen = "8/4P3/8/8/8/8/8/k6K w - - 0 1";
    const result = getMoveFen(prePromotionFen, "e7e8n");
    expect(result.fen).toContain("N");
    expect(result.promotion).toBe("n");
  });

  it("handles pawn promotion to rook", () => {
    const prePromotionFen = "8/4P3/8/8/8/8/8/k6K w - - 0 1";
    const result = getMoveFen(prePromotionFen, "e7e8r");
    expect(result.fen).toContain("R");
    expect(result.promotion).toBe("r");
  });

  it("handles pawn promotion to bishop", () => {
    const prePromotionFen = "8/4P3/8/8/8/8/8/k6K w - - 0 1";
    const result = getMoveFen(prePromotionFen, "e7e8b");
    expect(result.fen).toContain("B");
    expect(result.promotion).toBe("b");
  });

  it("throws on pawn moving backwards", () => {
    expect(() => getMoveFen(STARTING_FEN, "e2e1")).toThrow("Invalid move");
  });

  it("throws on move to occupied same-color square", () => {
    expect(() => getMoveFen(STARTING_FEN, "e1e2")).toThrow("Invalid move");
  });

  it("throws on move from empty square", () => {
    expect(() => getMoveFen(STARTING_FEN, "e5e6")).toThrow("Invalid move");
  });

  it("handles knight moves correctly", () => {
    const result = getMoveFen(STARTING_FEN, "g1f3");
    expect(result.from).toBe("g1");
    expect(result.to).toBe("f3");
    expect(result.promotion).toBeUndefined();
  });

  it("correctly updates FEN after pawn double push", () => {
    const result = getMoveFen(STARTING_FEN, "e2e4");
    // FEN after e2-e4 — the resulting position has e-pawn on e4
    expect(result.fen).toContain("4P3");
    // Black to move
    expect(result.fen).toContain(" b ");
  });

  it("changes side to move in resulting FEN", () => {
    const result = getMoveFen(STARTING_FEN, "e2e4");
    // FEN includes 'b' for black to move
    expect(result.fen).toContain(" b ");
  });
});
