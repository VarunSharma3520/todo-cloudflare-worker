import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text().notNull().default(""),
  completed: int({ mode: "boolean" }).notNull().default(false),
  createdAt: int({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
