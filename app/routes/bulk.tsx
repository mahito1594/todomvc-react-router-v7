import { data, redirect } from "react-router";
import { todoRepository } from "~/data/todoRepository.client";
import { validateTodoBulkUpdateData } from "~/data/validate.client";
import type { Route } from "./+types/bulk";

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  if (request.method !== "POST") {
    return data("Not Implemented", { status: 501 });
  }

  const payload = await request.json();

  switch (payload?.mode) {
    case "update":
      return updateActionHandler(payload);
    default:
      return data("Not Implemented", { status: 501 });
  }
};

const destroyActionHandler = async (_formData: FormData) => {
  console.log("TODO: implement destroyActionHandler");
};

const updateActionHandler = async (payload: unknown) => {
  const { todos } = validateTodoBulkUpdateData(payload);
  const tasks = todos.map((todo) =>
    todoRepository.update(todo.id, todo.title, todo.completed),
  );
  await Promise.all(tasks);
  return redirect("/");
};
