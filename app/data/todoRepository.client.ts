const store = localStorage;
const KEY = {
  todos: "todomvc:react-router:todos",
  nextId: "todomvc:react-router:nextId",
} as const;

const getAll = async (): Promise<
  {
    id: number;
    title: string;
    completed: boolean;
  }[]
> => {
  const rawTodos = store.getItem(KEY.todos);
  return rawTodos ? JSON.parse(rawTodos) : [];
};

const get = async (id: number) => {
  const todos = await getAll();
  return todos.find((todo) => todo.id === id);
};

export const add = async (title: string, completed = false) => {
  const nextId = Number(store.getItem(KEY.nextId)) || 0;
  const todo = { id: nextId, title, completed };
  const todos = await getAll();
  todos.push(todo);
  store.setItem(KEY.todos, JSON.stringify(todos));
  store.setItem(KEY.nextId, String(nextId + 1));
  return todo;
};

const update = async (id: number, title: string, completed: boolean) => {
  const todos = await getAll();
  const updated = todos.map((todo) => {
    if (todo.id !== id) {
      return todo;
    }
    return { ...todo, title, completed };
  });
  store.setItem(KEY.todos, JSON.stringify(updated));
  return { id, title, completed };
};

const destroy = async (id: number) => {
  const todos = await getAll();
  const updated = todos.filter((todo) => todo.id !== id);
  store.setItem(KEY.todos, JSON.stringify(updated));
  return true;
};

export const todoRepository = { getAll, get, add, update, destroy };
