import { eq, desc } from "drizzle-orm";
import type { Db } from "../db";
import { todos, type Todo } from "../db/schema";

export type CreateTodoInput = {
  title: string;
  description: string;
  completed: boolean;
};

export type UpdateTodoInput = Partial<Pick<Todo, "title" | "description" | "completed">>;

export async function findAll(db: Db): Promise<Todo[]> {
  return db.select().from(todos).orderBy(desc(todos.createdAt));
}

export async function findById(db: Db, id: number): Promise<Todo | null> {
  const rows = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function create(db: Db, input: CreateTodoInput): Promise<Todo> {
  const now = new Date();
  const inserted = await db
    .insert(todos)
    .values({
      title: input.title,
      description: input.description,
      completed: input.completed,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return inserted[0];
}

export async function update(db: Db, id: number, patch: UpdateTodoInput): Promise<Todo> {
  const updated = await db
    .update(todos)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(todos.id, id))
    .returning();
  return updated[0];
}

export async function remove(db: Db, id: number): Promise<Todo> {
  const deleted = await db.delete(todos).where(eq(todos.id, id)).returning();
  return deleted[0];
}
