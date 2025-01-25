import { z } from "zod";

// Define the Zod schema
export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

// Infer the type from the schema
export type TaskFormData = z.infer<typeof taskSchema>;
