import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Footer from "~/components/footer";

// #region mock
let mockSearchParam = new URLSearchParams();
const mockSetSearchParams = vi.fn((k) =>
  mockSearchParam.set("filter", k.filter),
);
const mockSubmit = vi.fn();

vi.mock("react-router", async () => {
  return {
    useFetcher: () => ({
      Form: ({ children }: { children: React.ReactNode }) => (
        <form>{children}</form>
      ),
      submit: mockSubmit,
    }),
    useSearchParams: () => [mockSearchParam, mockSetSearchParams],
  };
});
// #endregion

describe("Footer component", () => {
  afterEach(() => {
    vi.resetAllMocks();
    mockSearchParam = new URLSearchParams();
  });

  it("should not render when there are no todos", () => {
    render(<Footer todos={[]} />);
    expect(screen.queryByRole("footer")).not.toBeInTheDocument();
  });

  describe("should render filter buttons", () => {
    const mockTodos = [
      { id: 0, title: "Learn React", completed: true },
      { id: 1, title: "Learn Vue", completed: false },
    ];

    it("should call setSearchParams correctly", async () => {
      const user = userEvent.setup();
      render(<Footer todos={mockTodos} />);
      const allButton = screen.getByRole("button", { name: /^all$/i });
      const activeButton = screen.getByRole("button", { name: /^active/i });
      const completedButton = screen.getByRole("button", {
        name: /^completed$/i,
      });

      await user.click(activeButton);
      expect(mockSetSearchParams).toHaveBeenCalledWith({ filter: "active" });

      await user.click(completedButton);
      expect(mockSetSearchParams).toHaveBeenCalledWith({ filter: "completed" });

      await user.click(allButton);
      expect(mockSetSearchParams).toHaveBeenCalledWith({ filter: "all" });
    });

    describe("should render selected class", () => {
      it("when filterMode is `all`", () => {
        render(<Footer todos={mockTodos} />);
        expect(screen.getByRole("button", { name: /^all$/i })).toHaveClass(
          "selected",
        );
      });

      it("when filterMode is `active`", () => {
        mockSearchParam.set("filter", "active");
        render(<Footer todos={mockTodos} />);
        expect(screen.getByRole("button", { name: /^active$/i })).toHaveClass(
          "selected",
        );
      });

      it("when filterMode is `completed`", () => {
        mockSearchParam.set("filter", "completed");
        render(<Footer todos={mockTodos} />);
        expect(
          screen.getByRole("button", { name: /^completed$/i }),
        ).toHaveClass("selected");
      });
    });
  });

  describe("should render with number of left todos", () => {
    it("when there is an active todo", () => {
      const mockTodos = [{ id: 0, title: "Learn React", completed: false }];
      render(<Footer todos={mockTodos} />);
      expect(screen.getByText("1 item left!")).toBeInTheDocument();
    });

    it("when there is no active todo", () => {
      const mockTodos = [{ id: 0, title: "Learn React", completed: true }];
      render(<Footer todos={mockTodos} />);
      expect(screen.getByText("0 items left!")).toBeInTheDocument();
    });

    it("where there are an active and a completed todo", () => {
      const mockTodos = [
        { id: 0, title: "Learn React", completed: false },
        { id: 1, title: "Learn Vue", completed: true },
      ];
      render(<Footer todos={mockTodos} />);
      expect(screen.getByText("1 item left!")).toBeInTheDocument();
    });
  });

  describe("should render `Clear completed` button", () => {
    it("when there are completed todos", () => {
      const mockTodos = [{ id: 0, title: "Learn React", completed: false }];
      render(<Footer todos={mockTodos} />);
      expect(
        screen.queryByRole("button", { name: /clear completed/i }),
      ).not.toBeInTheDocument();
    });

    it("when there are some comleted todos", async () => {
      const mockTodos = [
        { id: 0, title: "Learn React", completed: true },
        { id: 1, title: "Learn Vue", completed: false },
      ];
      const user = userEvent.setup();
      render(<Footer todos={mockTodos} />);
      const button = screen.getByRole("button", { name: /clear completed/i });
      expect(button).toBeInTheDocument();
      await user.click(button);
      expect(mockSubmit).toHaveBeenCalledWith(
        { mode: "destroy", todos: [{ id: 0 }] },
        { action: "/bulk", method: "POST", encType: "application/json" },
      );
    });
  });
});
