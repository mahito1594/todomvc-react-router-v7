import { data, redirect } from "react-router";
import { ValiError } from "valibot";
import Header from "~/components/header";
import TodoList from "~/components/todoList";
import { todoRepository } from "~/data/todoRepository.client";
import { validateTodoData } from "~/data/validate.client";
import type { Route } from "./+types/index";

export const meta: Route.MetaFunction = () => [
  { title: "TodoMVC: React Router" },
  { name: "description", content: "A TodoMVC written in React Route@v7" },
];

export default function Index({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;

  return (
    <>
      <Header />
      <TodoList todos={todos} />
    </>
  );
}

export const clientLoader = async () => {
  const todos = await todoRepository.getAll();
  return data({ todos });
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  switch (request.method) {
    case "POST":
      return createActionHandler(request);
    default:
      return data("Not Implemented", { status: 501 });
  }
};

const createActionHandler = async (request: Request) => {
  try {
    const formData = await request.formData();
    formData.set("completed", "false"); // set default value
    const { title, completed } = validateTodoData(formData);
    await todoRepository.add(title, completed);
  } catch (error) {
    if (!(error instanceof ValiError)) {
      throw new Error("Error occurs when creating new todo", { cause: error });
    }
    return data({ error }, { status: 400 });
  }

  return redirect("/");
};
