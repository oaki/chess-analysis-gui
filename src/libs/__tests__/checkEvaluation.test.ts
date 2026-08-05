import { checkEvaluation, saveCriterium } from "../checkEvaluation";
import { LINE_MAP } from "../../interfaces";

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function makeEval(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    [LINE_MAP.score]: "0.5",
    [LINE_MAP.depth]: 25,
    [LINE_MAP.nodes]: saveCriterium.nodes,
    [LINE_MAP.pv]: "e2e4 e7e5",
    [LINE_MAP.mate]: false,
    ...overrides,
  } as Parameters<typeof checkEvaluation>[1];
}

describe("checkEvaluation", () => {
  it("returns true when all conditions met", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval())).toBe(true);
  });

  it("returns false when score too high", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval({ [LINE_MAP.score]: "5" }))).toBe(false);
  });

  it("returns false when nodes below threshold and not imported", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval({ [LINE_MAP.nodes]: 1000 }))).toBe(false);
  });

  it("returns true when imported flag is set even with low nodes", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval({ [LINE_MAP.nodes]: 1000, [LINE_MAP.import]: 1 }))).toBe(true);
  });

  it("returns false when mate", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval({ [LINE_MAP.mate]: true }))).toBe(false);
  });

  it("returns false when pv is missing", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval({ [LINE_MAP.pv]: "" }))).toBe(false);
  });

  it("returns false for position with 7 or fewer pieces", () => {
    // 2 kings only
    const fen = "8/8/8/8/8/8/8/K6k w - - 0 1";
    expect(checkEvaluation(fen, makeEval())).toBe(false);
  });

  it("returns false when useScore is true and score exceeds maxScore", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval({ [LINE_MAP.score]: "3" }), { useScore: true })).toBe(false);
  });

  it("returns true when useScore is false even with high score", () => {
    expect(checkEvaluation(STARTING_FEN, makeEval({ [LINE_MAP.score]: "3" }), { useScore: false })).toBe(true);
  });
});
