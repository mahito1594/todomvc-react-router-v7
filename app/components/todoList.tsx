import { useFetcher, useSearchParams } from "react-router";
import type { TodoListItemProps } from "./todoListItem";
import TodoListItem from "./todoListItem";

export type TodoListProps = {
  todos: TodoListItemProps[];
};

export default function TodoList({ todos }: TodoListProps) {
  const [searchParams] = useSearchParams();
  const filterMode = searchParams.get("filter") || "all";
  const visibleTodos = todos.filter((todo) => {
    switch (filterMode) {
      case "all":
        return true;
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const fetcher = useFetcher();
  const toggleAll: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    fetcher.submit(
      {
        mode: "update",
        todos: visibleTodos.map((todo) => ({
          ...todo,
          completed: ev.currentTarget.checked,
        })),
      },
      // encType: "application/x-www-form-urlencoded" does not work well, I don't know why
      { action: "/bulk", method: "POST", encType: "application/json" },
    );
  };

  return (
    <main className="main">
      {visibleTodos.length > 0 && (
        <div className="toggle-all-container">
          <input
            className="toggle-all"
            type="checkbox"
            id="toggle-all"
            checked={visibleTodos.every((todo) => todo.completed)}
            onChange={toggleAll}
          />
          <label htmlFor="toggle-all">Toggle All Input</label>
        </div>
      )}
      <ul className="todo-list">
        {visibleTodos.map((todo) => (
          <TodoListItem {...todo} key={todo.id} />
        ))}
      </ul>
    </main>
  );
}
