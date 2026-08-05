jest.mock("../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn(),
}));

import { setIsOnline } from "../onlineIndicator";

const IS_ONLINE = "services/onlineIndicator/is_online";

describe("setIsOnline", () => {
  it("creates IS_ONLINE action with true", () => {
    expect(setIsOnline(true)).toEqual({ type: IS_ONLINE, payload: true });
  });

  it("creates IS_ONLINE action with false", () => {
    expect(setIsOnline(false)).toEqual({ type: IS_ONLINE, payload: false });
  });

  it("coerces truthy value to boolean true", () => {
    expect(setIsOnline(1 as unknown as boolean).payload).toBe(true);
  });

  it("coerces falsy value to boolean false", () => {
    expect(setIsOnline(0 as unknown as boolean).payload).toBe(false);
  });
});
