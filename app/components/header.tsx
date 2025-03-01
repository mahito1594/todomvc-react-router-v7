import { useEffect, useRef } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const isSubmitted = fetcher.state !== "idle";

  useEffect(() => {
    if (!isSubmitted) {
      formRef.current?.reset();
    }
  }, [isSubmitted]);

  return (
    <div className="input-container">
      <fetcher.Form action="/?index" method="POST" ref={formRef}>
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
