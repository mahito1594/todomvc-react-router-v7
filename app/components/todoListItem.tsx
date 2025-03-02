import { useState } from "react";
import { useFetcher } from "react-router";

export type TodoListItemProps = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodoListItem({
  id,
  title,
  completed,
}: TodoListItemProps) {
  const [isEditable, setIsEditable] = useState(false);
  const handleDoubleClick = () => setIsEditable(true);
  const handleBlur = () => setIsEditable(false);

  return (
    <li className={completed ? "completed" : ""}>
      <div className="view">
        {isEditable ? (
          <EditableContent
            todo={{ id, title, completed }}
            onBlur={handleBlur}
          />
        ) : (
          <Content
            todo={{ id, title, completed }}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </div>
    </li>
  );
}

const EditableContent = ({
  todo,
  onBlur,
}: {
  todo: TodoListItemProps;
  onBlur: () => void;
}) => {
  const fetcher = useFetcher();

  return (
    <div className="input-container">
      <fetcher.Form
        action={`/${todo.id}`}
        method="PUT"
        onSubmit={(ev) => {
          fetcher.submit(ev.currentTarget.form);
          onBlur();
        }}
      >
        <input
          type="hidden"
          name="completed"
          value={todo.completed.toString()}
        />
        <input
          name="title"
          className="new-todo"
          id="todo-input"
          type="text"
          required
          // biome-ignore lint/a11y/noAutofocus: should be focused to edit todo
          autoFocus
          defaultValue={todo.title}
          onBlur={onBlur}
        />
        <label className="visually-hidden" htmlFor="todo-input">
          Edit todo item
        </label>
      </fetcher.Form>
    </div>
  );
};

const Content = ({
  todo,
  onDoubleClick,
}: {
  todo: TodoListItemProps;
  onDoubleClick: () => void;
}) => {
  const fetcher = useFetcher();
  const toggleItem = () =>
    fetcher.submit(
      { title: todo.title, completed: !todo.completed },
      { action: `/${todo.id}`, method: "PUT" },
    );
  const deleteItem = () =>
    fetcher.submit(null, { action: `/${todo.id}`, method: "DELETE" });

  return (
    <>
      <input
        className="toggle"
        type="checkbox"
        checked={todo.completed}
        id={`todo-item-${todo.id}`}
        onChange={toggleItem}
      />
      <p onDoubleClick={onDoubleClick}>{todo.title}</p>
      <button
        type="button"
        className="destroy"
        onClick={deleteItem}
        aria-label="Delete"
      />
    </>
  );
};
