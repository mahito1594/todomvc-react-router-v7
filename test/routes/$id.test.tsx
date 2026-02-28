import { beforeEach, describe, expect, it } from "vitest";
import { clientAction } from "~/routes/$id";

// #region mock
const initializeLocalStorage = (
  todos: { id: number; title: string; completed: boolean }[],
) => {
  localStorage.setItem("todomvc:react-router:nextId", todos.length.toString());
  localStorage.setItem("todomvc:react-router:todos", JSON.stringify(todos));
};

const createActionArgs = (request: Request, params: { id: string }) => ({
  request,
  params,
  unstable_pattern: "/:id",
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: {} as any,
  serverAction: async () => undefined,
});
// #endregion

describe("Client Action", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should delete todo", async () => {
    const todos = [
      { id: 0, title: "todo", completed: true },
      { id: 1, title: "another todo", completed: false },
    ];
    initializeLocalStorage(todos);

    const request = new Request("/todos/0", {
      method: "DELETE",
    });

    // send request
    const args = createActionArgs(request, { id: "0" });
    const response = await clientAction(args);

    // @ts-ignore
    expect(response.status).toBe(302);
    // @ts-ignore
    expect(response.headers.get("Location")).toBe("/");

    const updatedTodos = JSON.parse(
      // biome-ignore lint/style/noNonNullAssertion: ignore in tests
      localStorage.getItem("todomvc:react-router:todos")!,
    );
    expect(updatedTodos).toHaveLength(1);
    expect(updatedTodos[0]).toEqual(todos[1]);
  });

  it("should update todo", async () => {
    const todos = [
      { id: 0, title: "todo", completed: true },
      { id: 1, title: "another todo", completed: false },
    ];
    initializeLocalStorage(todos);

    const formData = new FormData();
    formData.set("title", "updated todo");
    formData.set("completed", "false");
    const request = new Request("/todos/0", {
      method: "PUT",
      body: formData,
    });

    // send request
    const args = createActionArgs(request, { id: "0" });
    const response = await clientAction(args);

    // @ts-ignore
    expect(response.data).toEqual({
      todo: {
        id: 0,
        title: "updated todo",
        completed: false,
      },
    });

    const updatedTodos = JSON.parse(
      // biome-ignore lint/style/noNonNullAssertion: ignore in tests
      localStorage.getItem("todomvc:react-router:todos")!,
    );
    expect(updatedTodos).toHaveLength(2);
    expect(updatedTodos[1]).toEqual(todos[1]);
  });
});
