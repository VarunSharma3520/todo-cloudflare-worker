import type { Context } from "hono";
import { getDb } from "../db";
import * as todoService from "../services/todo.service";

type Bindings = {
  DB: D1Database;
};

type C = Context<{ Bindings: Bindings }>;

export async function listTodosHandler(c: C) {
  try {
    const db = getDb(c.env.DB);
    const rows = await todoService.listTodos(db);
    return c.json({ status: true, data: rows }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ status: false, message: "Failed to fetch todos" }, 500);
  }
}

export async function getTodoHandler(c: C) {
  try {
    const { id } = c.req.valid("param" as never) as { id: number };
    const db = getDb(c.env.DB);
    const todo = await todoService.getTodo(db, id);
    if (!todo) {
      return c.json({ status: false, message: "Todo not found" }, 404);
    }
    return c.json({ status: true, data: todo }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ status: false, message: "Failed to fetch todo" }, 500);
  }
}

export async function createTodoHandler(c: C) {
  try {
    const input = c.req.valid("json" as never) as {
      title: string;
      description?: string;
      completed?: boolean;
    };
    const db = getDb(c.env.DB);
    const created = await todoService.createTodo(db, input);
    return c.json({ status: true, data: created }, 201);
  } catch (e) {
    console.error(e);
    return c.json({ status: false, message: "Failed to create todo" }, 500);
  }
}

export async function updateTodoHandler(c: C) {
  try {
    const { id } = c.req.valid("param" as never) as { id: number };
    const input = c.req.valid("json" as never) as {
      title?: string;
      description?: string;
      completed?: boolean;
    };
    const db = getDb(c.env.DB);
    const updated = await todoService.updateTodo(db, id, input);
    if (!updated) {
      return c.json({ status: false, message: "Todo not found" }, 404);
    }
    return c.json({ status: true, data: updated }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ status: false, message: "Failed to update todo" }, 500);
  }
}

export async function deleteTodoHandler(c: C) {
  try {
    const { id } = c.req.valid("param" as never) as { id: number };
    const db = getDb(c.env.DB);
    const deleted = await todoService.deleteTodo(db, id);
    if (!deleted) {
      return c.json({ status: false, message: "Todo not found" }, 404);
    }
    return c.json({ status: true, message: "Todo deleted", data: deleted }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ status: false, message: "Failed to delete todo" }, 500);
  }
}
