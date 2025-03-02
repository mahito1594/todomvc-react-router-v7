import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Header from "~/components/header";

// #region mock
let mockFetcherState = "idle";
vi.mock("react-router", () => {
  return {
    useFetcher: () => ({
      Form: ({
        children,
        ref,
      }: {
        children: React.ReactNode;
        ref: React.RefObject<HTMLFormElement | null>;
      }) => <form ref={ref}>{children}</form>,
      state: mockFetcherState,
      submit: vi.fn(),
    }),
  };
});
// #endregion

describe("Header component", () => {
  it("should render correctly", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Header />);
    const input = screen.getByLabelText(/new todo input/i);
    expect(input).toBeInTheDocument();

    await user.type(input, "Learn React");
    expect(input).toHaveValue("Learn React");

    mockFetcherState = "loading";
    rerender(<Header />);
    expect(screen.getByLabelText(/new todo input/i)).toHaveValue("");
  });
});
