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

const TodoBulkUpdateSchema = v.object({
  mode: v.literal("update"),
  todos: v.array(
    v.object({
      id: v.number(),
      title: v.string(),
      completed: v.boolean(),
    }),
  ),
});

export const validateTodoBulkUpdateData = (data: unknown) =>
  v.parse(TodoBulkUpdateSchema, data);
