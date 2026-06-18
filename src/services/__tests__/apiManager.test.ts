import { ApiManagerService } from "../apiManager";
import {
  buildAuthRequest,
  buildPublicRequest,
  executeApiRequest,
} from "../authenticatedApi";

jest.mock("../authenticatedApi", () => ({
  buildApiUrl: jest.fn(),
  buildAuthRequest: jest.fn((token, path, requestInit) => ({
    token,
    path,
    requestInit,
  })),
  buildPublicRequest: jest.fn((path, requestInit) => ({ path, requestInit })),
  executeApiRequest: jest.fn().mockResolvedValue({ ok: true }),
}));

describe("ApiManagerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses auth request for profile and history calls", async () => {
    await ApiManagerService.getProfile("token-1");
    await ApiManagerService.getLastGame("token-2");
    await ApiManagerService.getGame("token-3", 77);

    expect(buildAuthRequest).toHaveBeenNthCalledWith(1, "token-1", "/user/profile/");
    expect(buildAuthRequest).toHaveBeenNthCalledWith(2, "token-2", "/user/history:last");
    expect(buildAuthRequest).toHaveBeenNthCalledWith(3, "token-3", "/user/history/77");
    expect(executeApiRequest).toHaveBeenCalledTimes(3);
  });

  it("adds worker and saves logs with expected payload", async () => {
    await ApiManagerService.addWorker("token-x", "worker-a", "uuid-a");
    await ApiManagerService.saveLog([{ event: "x" }] as any);

    expect(buildAuthRequest).toHaveBeenCalledWith(
      "token-x",
      "/user/workers",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "worker-a", uuid: "uuid-a" }),
      })
    );
    expect(buildPublicRequest).toHaveBeenCalledWith(
      "/logs/save",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([{ event: "x" }]),
      })
    );
  });

  it("sends saveGame payload to history endpoint", async () => {
    const moves = [{ id: 1, move: "e2e4" }];
    await ApiManagerService.saveGame(moves, 99, "token-save");

    expect(buildAuthRequest).toHaveBeenCalledWith(
      "token-save",
      "/user/history/99",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ moves }),
      })
    );
  });

  it("imports PGN with auth token", async () => {
    await ApiManagerService.importGameFromPgn("1. e4 e5", "token-pgn");

    expect(buildAuthRequest).toHaveBeenCalledWith(
      "token-pgn",
      "/user/history/import-pgn",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ pgn: "1. e4 e5" }),
      })
    );
  });

  it("uses public request for auth register", async () => {
    await ApiManagerService.getUserBasedOnGoogleToken("google-jwt");

    expect(buildPublicRequest).toHaveBeenCalledWith(
      "/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ jwt_token: "google-jwt" }),
      })
    );
  });

  it("uses public request for temporary token flow", async () => {
    await ApiManagerService.getTemporaryToken();
    await ApiManagerService.verifyTemporaryToken("tmp");
    await ApiManagerService.pairGoogleTokenAndTemporaryToken("google", "tmp");
    await ApiManagerService.checkTemporaryToken("tmp");

    expect(buildPublicRequest).toHaveBeenCalledWith(
      "/auth/temporary-session",
      expect.objectContaining({ method: "GET" })
    );
    expect(buildPublicRequest).toHaveBeenCalledWith(
      "/auth/verify-temporary-session",
      expect.objectContaining({ method: "POST" })
    );
    expect(buildPublicRequest).toHaveBeenCalledWith(
      "/auth/pair-temporary-session",
      expect.objectContaining({ method: "POST" })
    );
    expect(buildPublicRequest).toHaveBeenCalledWith(
      "/auth/check-temporary-token",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("fetch resolves json for ok response", async () => {
    const fetchSpy = jest.spyOn(global, "fetch" as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    } as any);

    const result = await ApiManagerService.fetch("/x", { method: "GET" });
    expect(result).toEqual({ id: 1 });
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("fetch throws parsed payload for 403 response", async () => {
    jest.spyOn(global, "fetch" as any).mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "forbidden" }),
    } as any);

    await expect(ApiManagerService.fetch("/x", { method: "GET" })).rejects.toEqual({
      message: "forbidden",
    });
  });
});
