import type { Db } from "../db";
import * as todoRepo from "../repositories/todo.repository";

export async function listTodos(db: Db) {
  return todoRepo.findAll(db);
}

export async function getTodo(db: Db, id: number) {
  return todoRepo.findById(db, id);
}

export async function createTodo(
  db: Db,
  input: { title: string; description?: string; completed?: boolean }
) {
  return todoRepo.create(db, {
    title: input.title,
    description: input.description ?? "",
    completed: input.completed ?? false,
  });
}

export async function updateTodo(
  db: Db,
  id: number,
  patch: { title?: string; description?: string; completed?: boolean }
) {
  const existing = await todoRepo.findById(db, id);
  if (!existing) return null;
  return todoRepo.update(db, id, patch);
}

export async function deleteTodo(db: Db, id: number) {
  const existing = await todoRepo.findById(db, id);
  if (!existing) return null;
  return todoRepo.remove(db, id);
}
