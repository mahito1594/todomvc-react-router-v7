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
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (ev) => {
    if (ev.key !== "Enter") {
      return;
    }

    const value = ev.currentTarget.value.trim();
    if (value.length === 0) {
      return;
    }

    fetcher.submit(
      { title: value, completed: false },
      { action: "/?index", method: "POST" },
    );
    ev.currentTarget.value = "";
  };

  return (
    <div className="input-container">
      <input
        className="new-todo"
        id="todo-input"
        type="text"
        required
        placeholder="What needs to be done?"
        onKeyDown={handleKeyDown}
      />
      <label htmlFor="todo-input" className="visually-hidden">
        New Todo Input
      </label>
    </div>
  );
};
