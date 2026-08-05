import { renderHook, act } from "@testing-library/react";
import { useRefCallback } from "../useRefCallback";

describe("useRefCallback", () => {
  it("returns null initially", () => {
    const { result } = renderHook(() => useRefCallback<HTMLDivElement>());
    expect(result.current[0]).toBeNull();
  });

  it("returns a setter function", () => {
    const { result } = renderHook(() => useRefCallback<HTMLDivElement>());
    expect(typeof result.current[1]).toBe("function");
  });

  it("stores the node after setter is called", () => {
    const { result } = renderHook(() => useRefCallback<HTMLDivElement>());
    const fakeEl = document.createElement("div");
    act(() => {
      result.current[1](fakeEl);
    });
    expect(result.current[0]).toBe(fakeEl);
  });
});
