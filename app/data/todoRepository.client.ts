class FakeTodoRepository {
  private todos: { id: number; title: string; completed: boolean }[];
  private nextId: number;
  constructor() {
    this.todos = [];
    this.nextId = 0;
  }

  async getAll() {
    return this.todos;
  }

  async get(id: number) {
    return this.todos.find((todo) => todo.id === id);
  }

  async add(title: string, completed = false) {
    const todo = { id: this.nextId, title, completed };
    this.todos.push(todo);
    this.nextId++;
    return todo;
  }

  async update(id: number, title: string, completed: boolean) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      return;
    }
    todo.title = title;
    todo.completed = completed;
    return todo;
  }

  async destroy(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return true;
  }
}

export const todoRepository = new FakeTodoRepository();
