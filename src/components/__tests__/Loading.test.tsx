import React from "react";
import { render, screen } from "@testing-library/react";
import { Loading, SmallLoading } from "../Loading";

describe("Loading", () => {
  it("renders branded logo when loading", () => {
    render(<Loading isLoading={true} />);
    expect(
      screen.getByRole("img", { name: /chess-analysis-logo/i })
    ).toBeInTheDocument();
  });

  it("renders nothing when not loading", () => {
    const { container } = render(<Loading isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("SmallLoading", () => {
  it("renders spinner SVG when loading", () => {
    const { container } = render(<SmallLoading isLoading={true} />);
    expect(container.querySelector("svg.circular")).toBeInTheDocument();
  });

  it("renders nothing when not loading", () => {
    const { container } = render(<SmallLoading isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });
});
