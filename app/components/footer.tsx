import { NavLink, useSearchParams } from "react-router";
import { NavLlink, useFetcher, useSearchParams } from "react-router";

export type FooterProps = {
  todos: { id: number; completed: boolean }[];
};

export default function Footer({ todos }: FooterProps) {
  if (todos.length === 0) {
    return null;
  }

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const fetcher = useFetcher();
  const clearCompleted = () => {
    fetcher.submit(
      {
        mode: "destroy",
        todos: completedTodos.map((todo) => ({ id: todo.id })),
      },
      { action: "/bulk", method: "POST", encType: "application/json" },
    );
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const filterMode = searchParams.get("filter") || "all";

  return (
    <footer className="footer">
      <span className="todo-count">
        {`${activeTodos.length} ${activeTodos.length === 1 ? "item" : "items"} left!`}
      </span>
      <ul className="filters">
        <li>
          <NavLink
            to={{ pathname: "/", search: "?filter=all" }}
            className={filterMode === "all" ? "selected" : ""}
            end
          >
            All
          </NavLink>
        </li>
        <li>
          <NavLink
            to={{ pathname: "/", search: "?filter=active" }}
            className={filterMode === "active" ? "selected" : ""}
            end
          >
            Active
          </NavLink>
        </li>
        <li>
          <NavLink
            to={{ pathname: "/", search: "?filter=completed" }}
            className={filterMode === "completed" ? "selected" : ""}
            end
          >
            Completed
          </NavLink>
        </li>
      </ul>
      {completedTodos.length > 0 && (
        <button
          type="button"
          className="clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
}
