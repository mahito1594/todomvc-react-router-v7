import { data } from "react-router";
import Header from "~/components/header";
import TodoList from "~/components/todoList";
import { todoRepository } from "~/data/todoRepository.client";
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
