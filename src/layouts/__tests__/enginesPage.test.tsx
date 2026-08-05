jest.mock("../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({ workers: [] })), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn((sel) => sel({ workers: [] })),
}));

jest.mock("../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
}));

jest.mock("../../services/sessionManager", () => ({
  SessionManagerService: { getToken: jest.fn(() => "test-token") },
}));

jest.mock("../../services/apiManager", () => ({
  ApiManagerService: {
    loadWorkers: jest.fn().mockResolvedValue([]),
    addWorker: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("components/menu/menu", () => ({
  MenuWithRouter: () => <div data-testid="menu" />,
}));

jest.mock("components/Header", () => ({
  Header: ({ title }: { title: string }) => <div>{title}</div>,
}));

jest.mock("components/ui/list", () => ({
  List: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("components/ui/listItem", () => ({
  ListItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { Rows } from "../enginesPage";

describe("Rows (engines list)", () => {
  it("renders empty list without crashing", () => {
    const { container } = render(<Rows />);
    expect(container).toBeTruthy();
  });
});
