import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { todoRepository } from "~/data/todoRepository.client";

describe("todoRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should get empty array when there is no todo", async () => {
    const todos = await todoRepository.getAll();
    expect(todos).toHaveLength(0);
  });

  it("should add new todo and get one", async () => {
    const newTodo = await todoRepository.add("Learn React");
    expect(newTodo).toEqual({
      id: 0,
      title: "Learn React",
      completed: false,
    });

    const todo = await todoRepository.get(newTodo.id);
    expect(todo).toEqual(newTodo);

    const todos = await todoRepository.getAll();
    expect(todos).toHaveLength(1);
  });

  it("should update todo", async () => {
    const todo = await todoRepository.add("Learn React");
    const anotherTodo = await todoRepository.add("Learn Vue");

    const updatedTodo = await todoRepository.update(
      todo.id,
      "Learn React",
      true,
    );
    expect(updatedTodo).not.toEqual(todo);
    expect(updatedTodo).toEqual({
      id: todo.id,
      title: "Learn React",
      completed: true,
    });

    expect(await todoRepository.get(todo.id)).toEqual(updatedTodo);
    expect(await todoRepository.get(anotherTodo.id)).toEqual(anotherTodo);
  });

  it("should delete todo", async () => {
    const todo = await todoRepository.add("Learn React");
    const anotherTodo = await todoRepository.add("Learn Vue");

    await todoRepository.destroy(todo.id);
    expect(await todoRepository.get(todo.id)).toBeUndefined();
    expect(await todoRepository.get(anotherTodo.id)).toEqual(anotherTodo);
  });
});
