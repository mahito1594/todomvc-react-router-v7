import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import TodoListItem from "~/components/todoListItem";

// #region mock
const mockSubmit = vi.fn();
vi.mock("react-router", () => {
  return {
    useFetcher: () => ({
      Form: ({
        children,
        action,
        method,
        onSubmit,
      }: {
        children: React.ReactNode;
        action?: string;
        method?: string;
        onSubmit?: React.FormEventHandler;
      }) => (
        <form
          action={action}
          method={method}
          onSubmit={onSubmit}
          data-testid="todo-form" // workaround for form submission
        >
          {children}
        </form>
      ),
      submit: mockSubmit,
    }),
  };
});
// #endregion

describe("TodoListItem component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render an active todo, can mark as completed & delete", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TodoListItem id={0} title="Learn React" completed={false} />,
    );
    const checkbox = screen.getByRole("checkbox");
    const deleteButton = screen.getByLabelText(/delete/i);

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(mockSubmit).toHaveBeenCalledWith(
      { title: "Learn React", completed: true },
      { action: "/0", method: "PUT" },
    );

    rerender(<TodoListItem id={0} title="Learn React" completed={true} />);
    expect(checkbox).toBeChecked();
    expect(screen.getByRole("listitem")).toHaveClass("completed");

    await user.click(deleteButton);
    expect(mockSubmit).toHaveBeenCalledWith(null, {
      action: "/0",
      method: "DELETE",
    });
  });

  it("should render an editor when double clicked", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TodoListItem id={0} title="Learn React" completed={false} />,
    );
    const title = screen.getByText("Learn React");

    await user.dblClick(title);
    await waitFor(() => {
      expect(screen.getByLabelText(/edit todo item/i)).toBeInTheDocument();
    });

    await user.type(
      screen.getByLabelText(/edit todo item/i),
      "Learn Vue{enter}",
    );

    const form = screen.getByTestId("todo-form");
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.queryByLabelText(/edit todo item/i),
      ).not.toBeInTheDocument();
    });
  });
});
