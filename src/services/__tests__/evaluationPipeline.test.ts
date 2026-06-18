import { LINE_MAP } from "../../interfaces";
import {
  parseWorkerEvaluation,
  shouldUseLocalEvaluation,
  withReducedNodes,
} from "../evaluationPipeline";

describe("evaluationPipeline", () => {
  it("parses and keeps only active fen evaluations", () => {
    const result = parseWorkerEvaluation(
      JSON.stringify([
        { fen: "fen-1", [LINE_MAP.pv]: "e2e4", [LINE_MAP.score]: "1.2" },
        { fen: "fen-2", [LINE_MAP.pv]: "d2d4", [LINE_MAP.score]: "0.4" },
      ]),
      "fen-2"
    );

    expect(result).toEqual({
      fen: "fen-2",
      results: [{ fen: "fen-2", [LINE_MAP.pv]: "d2d4", [LINE_MAP.score]: "0.4" }],
    });
  });

  it("returns null for malformed payload", () => {
    expect(parseWorkerEvaluation("not-json", "fen-1")).toBeNull();
  });

  it("uses local evaluation only when heuristic threshold is met", () => {
    expect(
      shouldUseLocalEvaluation({
        [LINE_MAP.nodes]: 60_000_000,
        [LINE_MAP.score]: "4.2",
        [LINE_MAP.pv]: "e2e4 e7e5 g1f3",
        [LINE_MAP.depth]: 20,
      })
    ).toBe(true);

    expect(
      shouldUseLocalEvaluation({
        [LINE_MAP.nodes]: 10_000,
        [LINE_MAP.score]: "1.0",
        [LINE_MAP.pv]: "e2e4",
        [LINE_MAP.depth]: 6,
      })
    ).toBe(false);
  });

  it("reduces nodes in local cached evaluation", () => {
    const evaluation = withReducedNodes("fen-x", {
      [LINE_MAP.nodes]: 60_000_000,
      [LINE_MAP.score]: "2.0",
      [LINE_MAP.pv]: "e2e4 e7e5",
      [LINE_MAP.depth]: 18,
    });

    expect(evaluation.fen).toBe("fen-x");
    expect(evaluation[LINE_MAP.nodes]).toBe(10_000_000);
  });

  it("returns null when no items match active FEN", () => {
    const result = parseWorkerEvaluation(
      JSON.stringify([{ fen: "fen-A", [LINE_MAP.pv]: "e2e4", [LINE_MAP.score]: "0.3" }]),
      "fen-B"
    );
    expect(result).toBeNull();
  });

  it("returns null for empty array", () => {
    expect(parseWorkerEvaluation("[]", "fen-1")).toBeNull();
  });

  it("returns false for shouldUseLocalEvaluation when evaluation is null", () => {
    expect(shouldUseLocalEvaluation(null)).toBe(false);
  });

  it("returns false when score is below threshold even with high nodes", () => {
    expect(
      shouldUseLocalEvaluation({
        [LINE_MAP.nodes]: 100_000_000,
        [LINE_MAP.score]: "1.0",
        [LINE_MAP.pv]: "e2e4 e7e5 g1f3",
        [LINE_MAP.depth]: 20,
      })
    ).toBe(false);
  });

  it("returns false when pv is too short even with high nodes and score", () => {
    expect(
      shouldUseLocalEvaluation({
        [LINE_MAP.nodes]: 100_000_000,
        [LINE_MAP.score]: "5.0",
        [LINE_MAP.pv]: "e2",
        [LINE_MAP.depth]: 20,
      })
    ).toBe(false);
  });

  it("preserves all evaluation fields in withReducedNodes", () => {
    const original = {
      [LINE_MAP.nodes]: 80_000_000,
      [LINE_MAP.score]: "3.0",
      [LINE_MAP.pv]: "d2d4",
      [LINE_MAP.depth]: 15,
      [LINE_MAP.time]: "3000",
    };
    const result = withReducedNodes("fen-z", original);
    expect(result[LINE_MAP.score]).toBe("3.0");
    expect(result[LINE_MAP.pv]).toBe("d2d4");
    expect(result[LINE_MAP.time]).toBe("3000");
  });
});
