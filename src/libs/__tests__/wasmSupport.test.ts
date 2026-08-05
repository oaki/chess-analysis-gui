import { isWasmSupported } from "../wasmSupport";

describe("isWasmSupported", () => {
  it("returns false when window is undefined", () => {
    const originalWindow = global.window;
    // @ts-expect-error intentionally deleting window
    delete global.window;
    expect(isWasmSupported()).toBe(false);
    global.window = originalWindow;
  });

  it("returns false when WebAssembly is absent", () => {
    const originalWasm = (window as Window & { WebAssembly?: unknown }).WebAssembly;
    (window as Window & { WebAssembly?: unknown }).WebAssembly = undefined;
    expect(isWasmSupported()).toBe(false);
    (window as Window & { WebAssembly?: unknown }).WebAssembly = originalWasm;
  });

  it("returns true when WebAssembly.validate returns true", () => {
    const originalWasm = (window as Window & { WebAssembly?: unknown }).WebAssembly;
    (window as Window & { WebAssembly?: unknown }).WebAssembly = { validate: () => true };
    expect(isWasmSupported()).toBe(true);
    (window as Window & { WebAssembly?: unknown }).WebAssembly = originalWasm;
  });

  it("returns false when WebAssembly.validate returns false", () => {
    const originalWasm = (window as Window & { WebAssembly?: unknown }).WebAssembly;
    (window as Window & { WebAssembly?: unknown }).WebAssembly = { validate: () => false };
    expect(isWasmSupported()).toBe(false);
    (window as Window & { WebAssembly?: unknown }).WebAssembly = originalWasm;
  });
});
