import { data, redirect } from "react-router";
import { todoRepository } from "~/data/todoRepository.client";
import { validateTodoData } from "~/data/validate.client";
import type { Route } from "./+types/$id";

export const clientAction = async ({
  params,
  request,
}: Route.ClientActionArgs) => {
  const todoId = Number.parseInt(params.id, 10);

  switch (request.method) {
    case "DELETE":
      return destroyActionHandler(todoId);
    case "PUT":
      return updateActionHandler(todoId, request);
    default:
      return data("Not Implemented", { status: 501 });
  }
};

const destroyActionHandler = async (todoId: number) => {
  await todoRepository.destroy(todoId);
  return redirect("/");
};

const updateActionHandler = async (todoId: number, request: Request) => {
  const formData = await request.formData();
  const { title, completed } = validateTodoData(formData);
  const updatedTodo = await todoRepository.update(todoId, title, completed);
  return data({ todo: updatedTodo });
};
