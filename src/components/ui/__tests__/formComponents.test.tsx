import React from "react";
import { render, screen } from "@testing-library/react";
import {
  StyledFormWrapper,
  StyledPairsWrapper,
  StyledLabel,
  StyledInput,
  StyledBtn,
  StyledBtnText,
} from "../formComponents";

describe("formComponents styled components", () => {
  it("renders StyledFormWrapper with children", () => {
    render(<StyledFormWrapper>form</StyledFormWrapper>);
    expect(screen.getByText("form")).toBeTruthy();
  });

  it("renders StyledPairsWrapper with children", () => {
    render(<StyledPairsWrapper>pairs</StyledPairsWrapper>);
    expect(screen.getByText("pairs")).toBeTruthy();
  });

  it("renders StyledLabel with children", () => {
    render(<StyledLabel>label</StyledLabel>);
    expect(screen.getByText("label")).toBeTruthy();
  });

  it("renders StyledInput", () => {
    render(<StyledInput placeholder="test" />);
    expect(screen.getByPlaceholderText("test")).toBeTruthy();
  });

  it("renders StyledBtn with children", () => {
    render(<StyledBtn>Submit</StyledBtn>);
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  it("renders StyledBtnText with children", () => {
    render(<StyledBtnText>text</StyledBtnText>);
    expect(screen.getByText("text")).toBeTruthy();
  });
});
