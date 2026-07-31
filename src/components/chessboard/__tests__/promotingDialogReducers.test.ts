jest.mock("../../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  ErrorManager: class { handler = jest.fn(); },
  addError: jest.fn(),
  errorReducers: jest.fn(() => []),
  ErrorType: { INFO: "info", ERROR: "error" },
  ADD_ERROR: "ADD_ERROR",
  REMOVE_ERROR: "REMOVE_ERROR",
}));

jest.mock("../../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn(),
}));

import { promotionDialogReducer, setPromotionDialog, IShowPromotionDialogProps } from "../promotingDialogReducers";

const SET_PROMOTION_DIALOG = "SET_PROMOTION_DIALOG";

describe("setPromotionDialog", () => {
  it("creates action with correct type and payload", () => {
    const props: IShowPromotionDialogProps = { isOpen: true };
    expect(setPromotionDialog(props)).toEqual({ type: SET_PROMOTION_DIALOG, payload: props });
  });
});

describe("promotionDialogReducer", () => {
  it("returns default state", () => {
    const state = promotionDialogReducer(undefined, { type: "UNKNOWN", payload: { isOpen: false } });
    expect(state).toEqual({ isOpen: false });
  });

  it("sets dialog open", () => {
    const action = setPromotionDialog({ isOpen: true });
    const state = promotionDialogReducer({ isOpen: false }, action);
    expect(state.isOpen).toBe(true);
  });

  it("sets requestedParams when provided", () => {
    const params = { from: "e2", to: "e8", fen: "some_fen", id: 1 };
    const action = setPromotionDialog({ isOpen: true, requestedParams: params as IShowPromotionDialogProps["requestedParams"] });
    const state = promotionDialogReducer({ isOpen: false }, action);
    expect(state.requestedParams).toEqual(params);
  });
});
