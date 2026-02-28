import { beforeEach, describe, expect, it } from "vitest";
import { clientAction, clientLoader } from "~/routes/index";

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
  unstable_pattern: "/",
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: {} as any,
  serverAction: async () => undefined,
});
// #endregion

describe("Loader / Action", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should load todos", async () => {
    const todos = [
      { id: 0, title: "todo", completed: true },
      { id: 1, title: "another todo", completed: false },
    ];
    initializeLocalStorage(todos);

    const result = await clientLoader();
    expect(result.data).toEqual({ todos });
  });

  it("should create todo", async () => {
    const todos = [
      { id: 0, title: "todo", completed: true },
      { id: 1, title: "another todo", completed: false },
    ];
    initializeLocalStorage(todos);

    const formData = new FormData();
    formData.set("title", "new todo");
    formData.set("completed", "false");
    const request = new Request("/", { method: "POST", body: formData });

    // send request
    const args = createActionArgs(request);
    const response = await clientAction(args);

    // @ts-ignore
    expect(response.status).toBe(302);
    // @ts-ignore
    expect(response.headers.get("Location")).toBe("/");

    const newTodos = JSON.parse(
      // biome-ignore lint/style/noNonNullAssertion: ignore in tests
      localStorage.getItem("todomvc:react-router:todos")!,
    );
    expect(newTodos).toHaveLength(3);
    expect(newTodos[0]).toEqual(todos[0]);
    expect(newTodos[1]).toEqual(todos[1]);
    expect(newTodos[2]).toEqual({ id: 2, title: "new todo", completed: false });
  });

  it("should 400 error for invalid post requests", async () => {
    const formData = new FormData();
    formData.set("title", "");
    formData.set("completed", "false");
    const request = new Request("/", { method: "POST", body: formData });

    // send request
    const args = createActionArgs(request);
    const result = await clientAction(args);

    // @ts-ignore
    expect(result.init).toEqual({ status: 400 });
  });
});
