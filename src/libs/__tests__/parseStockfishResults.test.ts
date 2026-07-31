import { parseResult, parseOneLineResult, pairValues, parseLine } from "../parseStockfishResults";
import { LINE_MAP } from "../../interfaces";

const SAMPLE_LINE = "info depth 18 seldepth 25 multipv 1 score cp 25 nodes 1234567 nps 800000 tbhits 0 time 1543 pv e2e4 e7e5 g1f3";

describe("pairValues", () => {
  it("extracts value after named token", () => {
    expect(pairValues("depth", SAMPLE_LINE)).toBe("18");
    expect(pairValues("multipv", SAMPLE_LINE)).toBe("1");
    expect(pairValues("nodes", SAMPLE_LINE)).toBe("1234567");
  });

  it("extracts pv as everything after the token", () => {
    expect(pairValues("pv", SAMPLE_LINE)).toBe("e2e4 e7e5 g1f3");
  });

  it("throws when name not found", () => {
    expect(() => pairValues("missing", SAMPLE_LINE)).toThrow();
  });
});

describe("parseLine", () => {
  it("parses score as centipawns / 100", () => {
    const result = parseLine(SAMPLE_LINE);
    expect(result[LINE_MAP.score]).toBe("0.25");
  });

  it("parses pv moves", () => {
    const result = parseLine(SAMPLE_LINE);
    expect(result[LINE_MAP.pv]).toBe("e2e4 e7e5 g1f3");
  });

  it("sets mate to false when line has no mate keyword", () => {
    const result = parseLine(SAMPLE_LINE);
    expect(result[LINE_MAP.mate]).toBe(false);
  });

  it("sets mate to true when line contains 'mate' keyword", () => {
    // A line with both cp and mate keywords (mate appears in string but score comes from cp)
    const mateAwareLine = "info depth 5 seldepth 7 multipv 1 score cp 500 nodes 500 nps 600 tbhits 0 time 100 pv d1h5 f8e7 h5e5 mate 3";
    const result = parseLine(mateAwareLine);
    expect(result[LINE_MAP.mate]).toBe(true);
  });
});

describe("parseResult", () => {
  it("returns empty array when no info line", () => {
    expect(parseResult("bestmove e2e4", "fen")).toEqual([]);
  });

  it("returns empty array when no pv", () => {
    expect(parseResult("info depth 1 score cp 10", "fen")).toEqual([]);
  });

  it("parses a single line result", () => {
    const raw = SAMPLE_LINE + "\nbestmove e2e4";
    const result = parseResult(raw, "startfen");
    expect(result).toHaveLength(1);
    expect(result[0][LINE_MAP.pv]).toBe("e2e4 e7e5 g1f3");
  });
});

describe("parseOneLineResult", () => {
  it("returns null when no info", () => {
    expect(parseOneLineResult("bestmove e2e4")).toBeNull();
  });

  it("returns null when no pv", () => {
    expect(parseOneLineResult("info depth 1 score cp 10")).toBeNull();
  });

  it("parses a valid line", () => {
    const result = parseOneLineResult(SAMPLE_LINE);
    expect(result).not.toBeNull();
    expect(result![LINE_MAP.pv]).toBe("e2e4 e7e5 g1f3");
  });

  it("trims pv to numOfMoves", () => {
    const result = parseOneLineResult(SAMPLE_LINE, 1);
    expect(result![LINE_MAP.pv]).toBe("e2e4");
  });
});
