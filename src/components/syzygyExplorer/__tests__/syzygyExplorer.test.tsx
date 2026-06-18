import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SyzygyExplorer } from "../syzygyExplorer";
import type { ISyzygy } from "../syzygyExplorerReducers";

const mockSyzygy: ISyzygy = {
  checkmate: false,
  stalemate: false,
  variant_win: false,
  variant_loss: false,
  insufficient_material: false,
  wdl: 0,
  dtz: 0,
  moves: [
    { uci: "e2e4", san: "e4", zeroing: true, checkmate: false, stalemate: false, variant_win: false, variant_loss: false, insufficient_material: false, wdl: -2, dtz: 1 },
    { uci: "d2d4", san: "d4", zeroing: true, checkmate: false, stalemate: false, variant_win: false, variant_loss: false, insufficient_material: false, wdl: 0, dtz: 2 },
    { uci: "c2c4", san: "c4", zeroing: true, checkmate: false, stalemate: false, variant_win: false, variant_loss: false, insufficient_material: false, wdl: 2, dtz: 3 },
  ],
};

describe("SyzygyExplorer", () => {
  it("renders nothing when syzygy is null", () => {
    const { container } = render(
      <SyzygyExplorer syzygy={null} handleClickMove={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("groups moves and invokes handleClickMove", () => {
    const handleClickMove = jest.fn();
    render(<SyzygyExplorer syzygy={mockSyzygy} handleClickMove={handleClickMove} />);

    const e4 = screen.getByText("e4");
    fireEvent.click(e4.closest("button")!);
    expect(handleClickMove).toHaveBeenCalled();
  });
});
