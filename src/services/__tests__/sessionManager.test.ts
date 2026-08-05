import { SessionManagerService, TOKEN_NAME, TOKEN_TEMPORARY } from "../sessionManager";

describe("SessionManagerService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when token not set", () => {
    expect(SessionManagerService.getToken()).toBeNull();
  });

  it("sets and retrieves token", () => {
    SessionManagerService.setToken("test-token");
    expect(SessionManagerService.getToken()).toBe("test-token");
  });

  it("removes token", () => {
    SessionManagerService.setToken("test-token");
    SessionManagerService.removeToken();
    expect(SessionManagerService.getToken()).toBeNull();
  });

  it("returns null when temporary token not set", () => {
    expect(SessionManagerService.getTemporaryToken()).toBeNull();
  });

  it("sets and retrieves temporary token", () => {
    SessionManagerService.setTemporaryToken("temp-token");
    expect(SessionManagerService.getTemporaryToken()).toBe("temp-token");
  });

  it("removes temporary token", () => {
    SessionManagerService.setTemporaryToken("temp-token");
    SessionManagerService.removeTemporaryToken();
    expect(SessionManagerService.getTemporaryToken()).toBeNull();
  });

  it("uses localStorage as storage", () => {
    expect(SessionManagerService.getStorage()).toBe(localStorage);
  });
});
