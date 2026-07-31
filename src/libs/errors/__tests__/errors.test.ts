import { ConnectionError } from "../connectionError";
import { FetchError } from "../fetchError";

describe("ConnectionError", () => {
  it("is an instance of Error", () => {
    const err = new ConnectionError("conn failed");
    expect(err).toBeInstanceOf(Error);
  });

  it("extends Error", () => {
    const err = new ConnectionError("test");
    expect(err.message).toBe("test");
  });
});

describe("FetchError", () => {
  it("is an instance of Error", () => {
    const err = new FetchError("fetch failed");
    expect(err).toBeInstanceOf(Error);
  });

  it("stores string message", () => {
    const err = new FetchError("not found");
    expect(err.message).toBe("not found");
  });

  it("converts non-string message to string", () => {
    const err = new FetchError(404);
    expect(err.message).toBe("404");
  });

  it("handles object message", () => {
    const err = new FetchError({ code: 500 });
    expect(typeof err.message).toBe("string");
    expect(err.message.length).toBeGreaterThan(0);
  });
});
