import { describe, expect, it } from "vitest";
import {
  validateTodoBulkDestroyData,
  validateTodoBulkUpdateData,
  validateTodoData,
} from "~/data/validate.client";

describe("validateTodoData", () => {
  it("should validate todo data", () => {
    const correctForm = new FormData();
    correctForm.append("title", "Learn React");
    correctForm.append("completed", "false");
    expect(validateTodoData(correctForm)).toEqual({
      title: "Learn React",
      completed: false,
    });

    const incorrectForm = new FormData();
    incorrectForm.append("title", "");
    incorrectForm.append("completed", "false");
    expect(() => validateTodoData(incorrectForm)).toThrow();
  });

  it("should validate todo bulk update data", () => {
    const correctData = {
      mode: "update",
      todos: [
        { id: 0, title: "Learn React", completed: true },
        { id: 1, title: "Learn Vue", completed: true },
      ],
    };
    expect(validateTodoBulkUpdateData(correctData)).toEqual({
      mode: "update",
      todos: [
        { id: 0, title: "Learn React", completed: true },
        { id: 1, title: "Learn Vue", completed: true },
      ],
    });

    const dataLacked = {
      mode: "update",
      todos: [{ id: 0, title: "Learn React" }],
    };
    expect(() => validateTodoBulkUpdateData(dataLacked)).toThrow();

    const incorrectMode = {
      mode: "foo",
      todos: [{ id: 0, title: "Learn React", completed: true }],
    };
    expect(() => validateTodoBulkUpdateData(incorrectMode)).toThrow();
  });

  it("should validate todo bulk destroy data", () => {
    const correctData = {
      mode: "destroy",
      todos: [{ id: 0 }, { id: 1 }],
    };
    expect(validateTodoBulkDestroyData(correctData)).toEqual({
      mode: "destroy",
      todos: [{ id: 0 }, { id: 1 }],
    });

    const dataLacked = {
      mode: "destroy",
      todos: [{ title: "Learn React" }],
    };
    expect(() => validateTodoBulkDestroyData(dataLacked)).toThrow();

    const incorrectMode = {
      mode: "foo",
      todos: [{ id: 0 }],
    };
    expect(() => validateTodoBulkDestroyData(incorrectMode)).toThrow();
  });
});
