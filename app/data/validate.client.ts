import * as v from "valibot";

const TodoSchema = v.object({
  title: v.pipe(v.string(), v.trim(), v.nonEmpty()),
  completed: v.pipe(
    v.picklist(["true", "false"]),
    v.transform((value) => value === "true"),
  ),
});

export const validateTodoData = (form: FormData) => {
  const data = Object.fromEntries(form.entries());
  return v.parse(TodoSchema, data);
};
