import { renderHook, act } from "@testing-library/react";
import { useElementResize } from "../useElementResize";

describe("useElementResize", () => {
  it("returns zero sizes when element is null", () => {
    const { result } = renderHook(() => useElementResize(null));
    expect(result.current[0]).toEqual({ width: 0, height: 0 });
  });

  it("reads initial size from element", () => {
    const el = document.createElement("div");
    Object.defineProperty(el, "clientWidth", { value: 300, configurable: true });
    Object.defineProperty(el, "clientHeight", { value: 200, configurable: true });

    const { result } = renderHook(() => useElementResize(el));
    expect(result.current[0].width).toBe(300);
    expect(result.current[0].height).toBe(200);
  });

  it("returns a setSize function as second element", () => {
    const { result } = renderHook(() => useElementResize(null));
    expect(typeof result.current[1]).toBe("function");
  });

  it("updates sizes when setSize is called manually", () => {
    const el = document.createElement("div");
    Object.defineProperty(el, "clientWidth", { value: 400, configurable: true });
    Object.defineProperty(el, "clientHeight", { value: 300, configurable: true });

    const { result } = renderHook(() => useElementResize(el));

    Object.defineProperty(el, "clientWidth", { value: 500, configurable: true });
    Object.defineProperty(el, "clientHeight", { value: 400, configurable: true });

    act(() => {
      result.current[1]();
    });

    expect(result.current[0].width).toBe(500);
    expect(result.current[0].height).toBe(400);
  });

  it("removes resize listener on unmount", () => {
    const el = document.createElement("div");
    const removeSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useElementResize(el));
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });
});
