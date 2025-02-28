import type { TodoListItemProps } from "./todoListItem";
import TodoListItem from "./todoListItem";

export type TodoListProps = {
  todos: TodoListItemProps[];
};

export default function TodoList({ todos }: TodoListProps) {
  return (
    <main className="main">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoListItem {...todo} key={todo.id} />
        ))}
      </ul>
    </main>
  );
}
