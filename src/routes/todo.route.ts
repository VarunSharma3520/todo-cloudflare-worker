import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  idParamSchema,
  createTodoSchema,
  patchTodoSchema,
} from "../validations/todo.validation";
import {
  listTodosHandler,
  getTodoHandler,
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
} from "../controllers/todo.controller";

type Bindings = {
  DB: D1Database;
};

const router = new Hono<{ Bindings: Bindings }>();

router.get("/", listTodosHandler);
router.get("/:id", zValidator("param", idParamSchema), getTodoHandler);
router.post("/", zValidator("json", createTodoSchema), createTodoHandler);
router.patch(
  "/:id",
  zValidator("param", idParamSchema),
  zValidator("json", patchTodoSchema),
  updateTodoHandler
);
router.delete("/:id", zValidator("param", idParamSchema), deleteTodoHandler);

export default router;
