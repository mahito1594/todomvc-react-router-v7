import { useSearchParams } from "react-router";
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

  return (
    <main className="main">
      {visibleTodos.length > 0 && (
        <div className="toggle-all-container">
          <input
            className="toggle-all"
            type="checkbox"
            id="toggle-all"
            onChange={() => void 0} // TODO
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
