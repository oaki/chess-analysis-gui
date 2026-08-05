import { isOpeningMoveArray, isIEvaluation, isIHistoryGameResponse, isHistoryGameResponseList } from "../typeGuards";
import { LINE_MAP } from "../../interfaces";

const validOpeningMove = { move: "e4", weight: 100, fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", san: "e4" };
const validEvaluation = { [LINE_MAP.pv]: "e2e4 e7e5", [LINE_MAP.score]: "0.25", [LINE_MAP.depth]: 10 };
const validHistoryMove = { id: 1, parentId: 0, fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", notation: "e4", shortNotation: "e4" };
const validGame = { id: 1, user_id: 5, created_at: "2024-01-01", updated_at: "2024-01-01", moves: [validHistoryMove] };

describe("isOpeningMoveArray", () => {
  it("returns true for valid array", () => {
    expect(isOpeningMoveArray([validOpeningMove])).toBe(true);
  });

  it("returns true for empty array", () => {
    expect(isOpeningMoveArray([])).toBe(true);
  });

  it("returns false for non-array", () => {
    expect(isOpeningMoveArray(null)).toBe(false);
    expect(isOpeningMoveArray({})).toBe(false);
  });

  it("returns false when item is missing fields", () => {
    expect(isOpeningMoveArray([{ move: "e4" }])).toBe(false);
  });

  it("returns false when weight is not a number", () => {
    expect(isOpeningMoveArray([{ ...validOpeningMove, weight: "100" }])).toBe(false);
  });
});

describe("isIEvaluation", () => {
  it("returns true for valid evaluation", () => {
    expect(isIEvaluation(validEvaluation)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isIEvaluation(null)).toBe(false);
  });

  it("returns false when pv is missing", () => {
    expect(isIEvaluation({ [LINE_MAP.score]: "0.25", [LINE_MAP.depth]: 10 })).toBe(false);
  });

  it("returns false when score is not a string", () => {
    expect(isIEvaluation({ [LINE_MAP.pv]: "e2e4", [LINE_MAP.score]: 0.25 })).toBe(false);
  });
});

describe("isIHistoryGameResponse", () => {
  it("returns true for valid game", () => {
    expect(isIHistoryGameResponse(validGame)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isIHistoryGameResponse(null)).toBe(false);
  });

  it("returns false when moves is not an array", () => {
    expect(isIHistoryGameResponse({ ...validGame, moves: "not-array" })).toBe(false);
  });

  it("returns false when id is not a number", () => {
    expect(isIHistoryGameResponse({ ...validGame, id: "1" })).toBe(false);
  });
});

describe("isHistoryGameResponseList", () => {
  it("returns true for valid list", () => {
    expect(isHistoryGameResponseList([validGame])).toBe(true);
  });

  it("returns true for empty array", () => {
    expect(isHistoryGameResponseList([])).toBe(true);
  });

  it("returns false for non-array", () => {
    expect(isHistoryGameResponseList(validGame)).toBe(false);
  });
});
