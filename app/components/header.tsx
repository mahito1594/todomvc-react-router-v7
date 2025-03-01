import { useFetcher } from "react-router";

export default function Header() {
  return (
    <header className="header">
      <h1>todos</h1>
      <NewTodoItem />
    </header>
  );
}

const NewTodoItem = () => {
  const fetcher = useFetcher();

  return (
    <div className="input-container">
      <fetcher.Form action="/?index" method="POST">
        <input
          name="title"
          className="new-todo"
          id="todo-input"
          type="text"
          required
          placeholder="What needs to be done?"
        />
        <label htmlFor="todo-input" className="visually-hidden">
          New Todo Input
        </label>
      </fetcher.Form>
    </div>
  );
};
