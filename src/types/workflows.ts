import { z } from "zod";

export const WorkflowDTOSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  isGlobal: z.boolean(),
});

// Infer the TypeScript type from the Zod schema
export type WorkflowType = z.infer<typeof WorkflowDTOSchema>;
