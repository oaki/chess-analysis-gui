import React from "react";
import { render, screen } from "@testing-library/react";
import { StyledWrapperWithHeader, StyledContentWrapper } from "../styledWrapperWithHeader";

describe("StyledWrapperWithHeader", () => {
  it("renders children", () => {
    render(<StyledWrapperWithHeader>header content</StyledWrapperWithHeader>);
    expect(screen.getByText("header content")).toBeTruthy();
  });
});

describe("StyledContentWrapper", () => {
  it("renders children", () => {
    render(<StyledContentWrapper>scrollable content</StyledContentWrapper>);
    expect(screen.getByText("scrollable content")).toBeTruthy();
  });
});
