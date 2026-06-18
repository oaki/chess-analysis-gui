import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Error } from "../error";

describe("Error", () => {
  it("exposes the message on an alert and forwards dismiss", async () => {
    const user = userEvent.setup();
    const handleOnClick = jest.fn();
    render(
      <Error
        msg="Could not load games"
        identifier="history"
        handleOnClick={handleOnClick}
      />
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Could not load games");

    await user.click(screen.getByRole("button"));
    expect(handleOnClick).toHaveBeenCalledTimes(1);
  });
});
