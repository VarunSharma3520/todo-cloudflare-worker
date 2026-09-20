import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().default(""),
  completed: z.boolean().optional().default(false),
});

export const patchTodoSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    completed: z.boolean().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: "Empty update body" });

export type IdParam = z.infer<typeof idParamSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type PatchTodoInput = z.infer<typeof patchTodoSchema>;
