import type { Route } from "./+types/index";

export const meta: Route.MetaFunction = () => [
  { title: "TodoMVC: React Router" },
  { name: "description", content: "A TodoMVC written in React Route@v7" },
];

export default function Index() {
  return <p>TodoMVC: React Router</p>;
}
