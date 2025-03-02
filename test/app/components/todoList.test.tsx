import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import TodoList from "~/components/todoList";

// #region mock
let mockSearchParam = new URLSearchParams();
const mockSubmit = vi.fn();
vi.mock("react-router", () => {
  return {
    useFetcher: () => ({
      submit: mockSubmit,
    }),
    useSearchParams: () => [mockSearchParam, vi.fn()],
  };
});
// #endregion

describe("TodoList component", () => {
  afterEach(() => {
    vi.resetAllMocks();
    mockSearchParam = new URLSearchParams();
  });

  describe("there are only active todos", () => {
    const mockTodos = [
      { id: 0, title: "Learn React", completed: false },
      { id: 1, title: "Learn Vue", completed: false },
    ];

    it("when no searchParam", async () => {
      const user = userEvent.setup();
      render(<TodoList todos={mockTodos} />);
      expect(screen.queryAllByRole("listitem")).toHaveLength(2);

      const toggleButton = screen.getByLabelText(/toggle all input/i);
      await user.click(toggleButton);
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          mode: "update",
          todos: mockTodos.map((todo) => ({ ...todo, completed: true })),
        },
        { action: "/bulk", method: "POST", encType: "application/json" },
      );
    });

    it("when searchParam is `?filter=completed`", async () => {
      mockSearchParam.set("filter", "completed");
      render(<TodoList todos={mockTodos} />);
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/toggle all input/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("there are only completed todos", () => {
    const mockTodos = [
      { id: 0, title: "Learn React", completed: true },
      { id: 1, title: "Learn Vue", completed: true },
    ];

    it("when no searchParam", async () => {
      const user = userEvent.setup();
      render(<TodoList todos={mockTodos} />);
      expect(screen.queryAllByRole("listitem")).toHaveLength(2);

      const toggleButton = screen.getByLabelText(/toggle all input/i);
      await user.click(toggleButton);
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          mode: "update",
          todos: mockTodos.map((todo) => ({ ...todo, completed: false })),
        },
        { action: "/bulk", method: "POST", encType: "application/json" },
      );
    });

    it("when searchParam is `?filter=active`", async () => {
      mockSearchParam.set("filter", "active");
      render(<TodoList todos={mockTodos} />);
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/toggle all input/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("there are both active and completed todos", () => {
    const mockTodos = [
      { id: 0, title: "Learn React", completed: true },
      { id: 1, title: "Learn Vue", completed: false },
    ];

    it("when no searchParam", async () => {
      const user = userEvent.setup();
      render(<TodoList todos={mockTodos} />);
      expect(screen.queryAllByRole("listitem")).toHaveLength(2);

      const toggleButton = screen.getByLabelText(/toggle all input/i);
      await user.click(toggleButton);
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          mode: "update",
          todos: [{ id: 1, title: "Learn Vue", completed: true }],
        },
        { action: "/bulk", method: "POST", encType: "application/json" },
      );
    });

    it("when searchParam is `?filter=active`", async () => {
      const user = userEvent.setup();
      mockSearchParam.set("filter", "active");
      render(<TodoList todos={mockTodos} />);
      expect(screen.queryByRole("listitem")).not.toHaveTextContent(
        "Learn React",
      );
      expect(screen.queryByRole("listitem")).toHaveTextContent("Learn Vue");
      const toggleButton = screen.getByLabelText(/toggle all input/i);
      await user.click(toggleButton);
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          mode: "update",
          todos: [{ id: 1, title: "Learn Vue", completed: true }],
        },
        { action: "/bulk", method: "POST", encType: "application/json" },
      );
    });

    it("when searchParam is `?filter=completed`", async () => {
      const user = userEvent.setup();
      mockSearchParam.set("filter", "completed");
      render(<TodoList todos={mockTodos} />);
      expect(screen.queryByRole("listitem")).toHaveTextContent("Learn React");
      expect(screen.queryByRole("listitem")).not.toHaveTextContent("Learn Vue");
      const toggleButton = screen.getByLabelText(/toggle all input/i);
      await user.click(toggleButton);
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          mode: "update",
          todos: [{ id: 0, title: "Learn React", completed: false }],
        },
        { action: "/bulk", method: "POST", encType: "application/json" },
      );
    });
  });
});
