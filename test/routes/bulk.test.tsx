import { beforeEach, describe, expect, it } from "vitest";
import { clientAction } from "~/routes/bulk";

// #region mock
const initializeLocalStorage = (
  todos: { id: number; title: string; completed: boolean }[],
) => {
  localStorage.setItem("todomvc:react-router:nextId", todos.length.toString());
  localStorage.setItem("todomvc:react-router:todos", JSON.stringify(todos));
};

const createActionArgs = (request: Request) => ({
  request,
  params: {},
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: {} as any,
  serverAction: async () => undefined,
});
// #endregion

describe("Bulk Api", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should bulk delete todos", async () => {
    const todos = [
      { id: 0, title: "todo", completed: true },
      { id: 1, title: "another todo", completed: false },
    ];
    initializeLocalStorage(todos);

    const body = JSON.stringify({
      mode: "destroy",
      todos: [{ id: 0 }, { id: 1 }],
    });
    const request = new Request("/todos/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    // send request
    const args = createActionArgs(request);
    const response = await clientAction(args);

    // @ts-ignore
    expect(response.status).toBe(302);
    // @ts-ignore
    expect(response.headers.get("Location")).toBe("/");

    const updatedTodos = JSON.parse(
      // biome-ignore lint/style/noNonNullAssertion: ignore in tests
      localStorage.getItem("todomvc:react-router:todos")!,
    );
    expect(updatedTodos).toHaveLength(0);
  });

  it("should bulk update todos", async () => {
    const todos = [
      { id: 0, title: "todo", completed: true },
      { id: 1, title: "another todo", completed: false },
    ];
    initializeLocalStorage(todos);

    const body = JSON.stringify({
      mode: "update",
      todos: [
        { id: 0, title: "updated todo", completed: false },
        { id: 1, title: "updated another todo", completed: true },
      ],
    });
    const request = new Request("/todos/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    // send request
    const args = createActionArgs(request);
    const response = await clientAction(args);

    // @ts-ignore
    expect(response.status).toBe(302);
    // @ts-ignore
    expect(response.headers.get("Location")).toBe("/");

    const updatedTodos = JSON.parse(
      // biome-ignore lint/style/noNonNullAssertion: ignore in tests
      localStorage.getItem("todomvc:react-router:todos")!,
    );
    expect(updatedTodos).toHaveLength(2);
    expect(updatedTodos[0]).toEqual({
      id: 0,
      title: "updated todo",
      completed: false,
    });
    expect(updatedTodos[1]).toEqual({
      id: 1,
      title: "updated another todo",
      completed: true,
    });
  });
});
