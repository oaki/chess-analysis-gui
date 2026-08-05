import { selectCalculationStrategy } from "../calculationStrategy";
import { LINE_MAP } from "../../interfaces";

function makeEval(score: number, time: number, mate: number = 0) {
  return {
    [LINE_MAP.score]: String(score),
    [LINE_MAP.time]: String(time * 1000),
    [LINE_MAP.mate]: mate !== 0,
    [LINE_MAP.depth]: 20,
    [LINE_MAP.pv]: "e2e4",
  };
}

describe("selectCalculationStrategy", () => {
  it("returns false for low score and low time", () => {
    expect(selectCalculationStrategy(makeEval(1, 1))).toBe(false);
  });

  it("returns true for score > 8 and time > 3", () => {
    expect(selectCalculationStrategy(makeEval(9, 4))).toBe(true);
  });

  it("returns true for score > 7 and time > 4", () => {
    expect(selectCalculationStrategy(makeEval(7.5, 5))).toBe(true);
  });

  it("returns true for score > 6 and time > 5", () => {
    expect(selectCalculationStrategy(makeEval(6.5, 6))).toBe(true);
  });

  it("returns true for score > 5 and time > 7", () => {
    expect(selectCalculationStrategy(makeEval(5.5, 8))).toBe(true);
  });

  it("returns true for score > 4 and time > 8", () => {
    expect(selectCalculationStrategy(makeEval(4.5, 9))).toBe(true);
  });

  it("returns true for score > 3 and time > 10", () => {
    expect(selectCalculationStrategy(makeEval(3.5, 11))).toBe(true);
  });

  it("returns true when close mate (< 6)", () => {
    const e = { ...makeEval(0, 1), [LINE_MAP.mate]: true, [LINE_MAP.score]: "0" };
    // mate field is boolean in interface but we need the numeric mate for toMate calc
    // Since LINE_MAP.mate is boolean in the interface, we test via numeric approach:
    // The function reads LINE_MAP.mate as number. Let's pass a numeric-ish mate
    const eWithMate = { ...makeEval(0, 1), [LINE_MAP.mate]: 3 as unknown as boolean };
    expect(selectCalculationStrategy(eWithMate)).toBe(true);
  });
});
