import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useSessionBootstrap } from "../useSessionBootstrap";
import { bootstrapSession } from "../../services/sessionBootstrap";

jest.mock("../../services/sessionBootstrap", () => ({
  bootstrapSession: jest.fn(),
}));

function Probe(props: { token: string | null; dispatch: jest.Mock; connect: jest.Mock }) {
  const state = useSessionBootstrap({
    token: props.token,
    dispatch: props.dispatch,
    connect: props.connect,
  });

  return <div data-testid="state">{JSON.stringify(state)}</div>;
}

describe("useSessionBootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts in loading state and updates from bootstrap result", async () => {
    (bootstrapSession as jest.Mock).mockResolvedValue({
      isLoaded: true,
      profileError: false,
      historyError: false,
    });

    render(<Probe token="token" dispatch={jest.fn()} connect={jest.fn()} />);

    expect(screen.getByTestId("state")).toHaveTextContent('"isLoaded":false');

    await waitFor(() =>
      expect(screen.getByTestId("state")).toHaveTextContent('"isLoaded":true')
    );
  });
});
