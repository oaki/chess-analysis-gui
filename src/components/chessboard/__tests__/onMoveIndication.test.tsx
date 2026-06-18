jest.mock("../../../store", () => ({
  __esModule: true,
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({})),
    subscribe: jest.fn(),
  },
  useAppStore: jest.fn(),
}));

import React from "react";
import { render } from "@testing-library/react";
import { OnMoveIndication } from "../onMoveIndication";
import { IOnMove } from "../../../actions";

describe("OnMoveIndication", () => {
  it("renders indicator root", () => {
    const { container } = render(
      <OnMoveIndication isFlip={false} onMove={IOnMove.WHITE} />
    );
    expect(container.querySelector(".on-move-indicator")).toBeInTheDocument();
  });
});
