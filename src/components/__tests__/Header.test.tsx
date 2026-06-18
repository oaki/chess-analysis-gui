import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../Header";

describe("Header", () => {
  it("renders title and a home link", () => {
    render(
      <MemoryRouter>
        <Header title="Engine workers" />
      </MemoryRouter>
    );

    expect(screen.getByText("Engine workers")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/");
  });
});
