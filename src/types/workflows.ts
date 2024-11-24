import { z } from "zod";

export const WorkflowDTOSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  isGlobal: z.boolean(),
});

export type WorkflowDTO = z.infer<typeof WorkflowDTOSchema>;
