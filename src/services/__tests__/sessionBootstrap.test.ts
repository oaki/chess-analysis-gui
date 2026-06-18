import { bootstrapSession } from "../sessionBootstrap";

describe("bootstrapSession", () => {
  it("loads immediately when token is missing", async () => {
    const dispatch = jest.fn();
    const connect = jest.fn();

    const result = await bootstrapSession(null, { dispatch, connect });

    expect(result).toEqual({
      isLoaded: true,
      profileError: false,
      historyError: false,
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(connect).not.toHaveBeenCalled();
  });

  it("returns profile error when profile fetch fails", async () => {
    const dispatch = jest.fn();
    const connect = jest.fn();
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const result = await bootstrapSession("token", { dispatch, fetchImpl, connect });

    expect(result).toEqual({
      isLoaded: true,
      profileError: true,
      historyError: false,
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(connect).not.toHaveBeenCalled();
  });

  it("returns history error when history fetch fails", async () => {
    const dispatch = jest.fn();
    const connect = jest.fn();
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 10, name: "User" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

    const result = await bootstrapSession("token", { dispatch, fetchImpl, connect });

    expect(result).toEqual({
      isLoaded: true,
      profileError: false,
      historyError: true,
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(connect).not.toHaveBeenCalled();
  });

  it("hydrates store and connects socket when startup succeeds", async () => {
    const dispatch = jest.fn();
    const connect = jest.fn();
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 10, name: "User", isLoggedIn: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 99, moves: [{ id: 1 }] }),
      });

    const result = await bootstrapSession("token", { dispatch, fetchImpl, connect });

    expect(result).toEqual({
      isLoaded: true,
      profileError: false,
      historyError: false,
    });
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(connect).toHaveBeenCalledWith("token");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
