jest.mock("../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: (selector: (s: Record<string, unknown>) => unknown) => selector({}),
}));

jest.mock("../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { shallowEqual, connect } from "../stateCompat";

describe("shallowEqual", () => {
  it("returns true for identical primitives", () => {
    expect(shallowEqual(1, 1)).toBe(true);
    expect(shallowEqual("a", "a")).toBe(true);
  });

  it("returns false for different primitives", () => {
    expect(shallowEqual(1, 2)).toBe(false);
  });

  it("returns true for shallow-equal objects", () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it("returns false for objects with different values", () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it("returns false for objects with different keys", () => {
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("returns false for null vs object", () => {
    expect(shallowEqual(null, {})).toBe(false);
    expect(shallowEqual({}, null)).toBe(false);
  });

  it("returns true for Object.is equality (same reference)", () => {
    const obj = { x: 1 };
    expect(shallowEqual(obj, obj)).toBe(true);
  });
});

describe("connect", () => {
  it("renders wrapped component with mapped state props", () => {
    const Base = ({ label }: { label: string }) => <span>{label}</span>;
    const mapState = () => ({ label: "hello" });
    const Connected = connect(mapState)(Base as unknown as React.ComponentType<Record<string, unknown>>);
    render(<Connected />);
    expect(screen.getByText("hello")).toBeTruthy();
  });
});
