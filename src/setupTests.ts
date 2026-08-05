import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(global, "fetch", {
  writable: true,
  value: jest.fn(),
});

class MockWorker {
  public postMessage = jest.fn();
  public addEventListener = jest.fn();
  public removeEventListener = jest.fn();
}

Object.defineProperty(window, "Worker", {
  writable: true,
  value: MockWorker,
});
