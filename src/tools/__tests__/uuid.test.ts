import { guid, id } from "../uuid";

describe("guid", () => {
  it("returns a non-empty string", () => {
    expect(typeof guid()).toBe("string");
    expect(guid().length).toBeGreaterThan(0);
  });

  it("has dashes in expected positions (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)", () => {
    const result = guid();
    const parts = result.split("-");
    expect(parts).toHaveLength(5);
    expect(parts[0]).toHaveLength(8);
  });

  it("generates unique values", () => {
    const a = guid();
    const b = guid();
    expect(a).not.toBe(b);
  });
});

describe("id", () => {
  it("returns incrementing numeric ids", () => {
    const first = id();
    const second = id();
    expect(second).toBe(first + 1);
  });
});
