import { renderHook } from "@testing-library/react";
import { useInterval } from "../useInterval";

describe("useInterval", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("calls callback at each interval tick", () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 100));

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("clears interval on unmount", () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 100));

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();
    jest.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("uses the latest callback reference", () => {
    let count = 0;
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 100), {
      initialProps: { cb: () => { count++; } },
    });

    jest.advanceTimersByTime(100);
    expect(count).toBe(1);

    rerender({ cb: () => { count += 10; } });
    jest.advanceTimersByTime(100);
    expect(count).toBe(11);
  });
});
