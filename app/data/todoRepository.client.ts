class FakeTodoRepository {
  private todos;
  private nextId: number;
  constructor() {
    this.todos = [
      { id: 0, title: "Learn React", completed: true },
      { id: 1, title: "Learn React Router", completed: true },
      { id: 2, title: "Learn Remix", completed: false },
    ];
    this.nextId = 3;
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
