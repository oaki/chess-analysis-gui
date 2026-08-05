jest.mock("../../../store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ errors: [] })),
    subscribe: jest.fn(() => jest.fn()),
  },
  useAppStore: jest.fn((sel) => sel({ errors: [] })),
}));

jest.mock("../../../services/errorManager", () => ({
  removeError: jest.fn((p) => ({ type: "REMOVE_ERROR", payload: p })),
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
  ErrorType: { INFO: "info", ERROR: "error" },
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { Errors } from "../errorController";
import { ErrorType, IErrorProps } from "../../../services/errorManager";

const noopClick = () => {};

function makeError(overrides: Partial<IErrorProps> = {}): IErrorProps {
  return {
    msg: "Test error",
    identifier: "e1",
    type: ErrorType.ERROR,
    delay: 3,
    handleOnClick: noopClick,
    ...overrides,
  };
}

describe("Errors", () => {
  it("renders nothing when errors is empty", () => {
    const { container } = render(<Errors errors={[]} />);
    expect(container.querySelectorAll(".error, [class*='error']")).toHaveLength(0);
  });

  it("renders one error message", () => {
    render(<Errors errors={[makeError({ msg: "Something went wrong" })]} />);
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("renders multiple errors", () => {
    const errors = [
      makeError({ msg: "Error one", identifier: "e1" }),
      makeError({ msg: "Error two", identifier: "e2" }),
    ];
    render(<Errors errors={errors} />);
    expect(screen.getByText("Error one")).toBeTruthy();
    expect(screen.getByText("Error two")).toBeTruthy();
  });
});
