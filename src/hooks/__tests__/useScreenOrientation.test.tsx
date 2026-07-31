import { renderHook, act } from "@testing-library/react";
import { useScreenOrientation, Orientation } from "../useScreenOrientation";

describe("useScreenOrientation", () => {
  const setWindowSize = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", { value: width, writable: true });
    Object.defineProperty(window, "innerHeight", { value: height, writable: true });
  };

  it("returns landscape when width > height", () => {
    setWindowSize(1280, 800);
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe(Orientation.landscape);
  });

  it("returns portrait when height >= width", () => {
    setWindowSize(375, 812);
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe(Orientation.portrait);
  });

  it("updates orientation on resize", () => {
    setWindowSize(1280, 800);
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe(Orientation.landscape);

    act(() => {
      setWindowSize(375, 812);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(Orientation.portrait);
  });

  it("cleans up resize listener on unmount", () => {
    const removeSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScreenOrientation());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });
});
