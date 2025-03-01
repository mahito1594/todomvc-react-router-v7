import { data, redirect } from "react-router";
import { todoRepository } from "~/data/todoRepository.client";
import { validateTodoData } from "~/data/validate.client";
import type { Route } from "./+types/$id";

export const clientAction = async ({
  params,
  request,
}: Route.ClientActionArgs) => {
  const todoId = Number.parseInt(params.id, 10);

  if (request.method === "DELETE") {
    await todoRepository.destroy(todoId);
    return redirect("/");
  }

  if (request.method === "PUT") {
    const formData = await request.formData();
    const { title, completed } = validateTodoData(formData);
    const updatedTodo = await todoRepository.update(todoId, title, completed);
    return data({ todo: updatedTodo });
  }

  return data("Not Implemented", { status: 501 });
};
