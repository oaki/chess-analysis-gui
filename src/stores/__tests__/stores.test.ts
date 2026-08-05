jest.mock("../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn(),
}));

import { useAnalysisStore } from "../analysisStore";
import { useGameStore } from "../gameStore";
import { useSessionStore } from "../sessionStore";
import { useUiStore } from "../uiStore";

// All stores are selector factories. Verify they are callable functions
// (the actual store behavior is covered by reducers tests and integration tests).

describe("analysisStore", () => {
  it("exports useAnalysisStore as a function", () => {
    expect(typeof useAnalysisStore).toBe("function");
  });
});

describe("gameStore", () => {
  it("exports useGameStore as a function", () => {
    expect(typeof useGameStore).toBe("function");
  });
});

describe("sessionStore", () => {
  it("exports useSessionStore as a function", () => {
    expect(typeof useSessionStore).toBe("function");
  });
});

describe("uiStore", () => {
  it("exports useUiStore as a function", () => {
    expect(typeof useUiStore).toBe("function");
  });
});
