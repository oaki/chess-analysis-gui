/** Minimal WebAssembly global shape used by Stockfish bootstrap. */
type WebAssemblyGlobal = {
  validate: (buffer: ArrayBufferView) => boolean;
};

function readWebAssembly(w: Window & typeof globalThis): WebAssemblyGlobal | undefined {
  const wa = (w as Window & { WebAssembly?: unknown }).WebAssembly;
  if (typeof wa !== "object" || wa === null) {
    return undefined;
  }
  const candidate = wa as { validate?: unknown };
  if (typeof candidate.validate !== "function") {
    return undefined;
  }
  return candidate as WebAssemblyGlobal;
}

/** True when the environment exposes WebAssembly that validates a minimal wasm header. */
export function isWasmSupported(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const wasm = readWebAssembly(window);
  if (!wasm) {
    return false;
  }
  const probe = Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00);
  return wasm.validate(probe);
}
