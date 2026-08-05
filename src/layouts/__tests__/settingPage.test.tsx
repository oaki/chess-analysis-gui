jest.mock("../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn((sel) => sel({ settings: { showEvaluation: true } })),
}));

jest.mock("../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
}));

jest.mock("react-toggle", () => ({
  __esModule: true,
  default: ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <input type="checkbox" checked={checked} onChange={onChange} data-testid="toggle" />
  ),
}));

jest.mock("../../components/menu/menu", () => ({
  MenuWithRouter: () => <div data-testid="menu" />,
}));

jest.mock("../../components/Header", () => ({
  Header: ({ title }: { title: string }) => <div>{title}</div>,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { SettingPage } from "../settingPage";

const Page = SettingPage as React.ComponentType<Record<string, unknown>>;

describe("SettingPage", () => {
  it("renders without crashing", () => {
    render(<Page />);
    expect(screen.getByTestId("toggle")).toBeTruthy();
  });

  it("renders menu", () => {
    render(<Page />);
    expect(screen.getByTestId("menu")).toBeTruthy();
  });
});
