import {
  buildApiUrl,
  buildAuthRequest,
  buildPublicRequest,
  executeApiRequest,
} from "../authenticatedApi";

describe("authenticatedApi", () => {
  it("builds absolute urls from api host", () => {
    expect(buildApiUrl("/user/profile/")).toContain("/user/profile/");
  });

  it("adds authorization header for auth requests", () => {
    const request = buildAuthRequest("abc", "/user/profile/");
    const headers = request.requestInit.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer abc");
  });

  it("builds public request without auth header", () => {
    const request = buildPublicRequest("/auth/register", { method: "POST" });
    expect(request.requestInit.method).toBe("POST");
  });

  it("parses successful json response", async () => {
    const payload = { ok: true };
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });

    const result = await executeApiRequest(
      buildPublicRequest("/auth/register"),
      fetchImpl
    );

    expect(result).toEqual(payload);
  });
});
