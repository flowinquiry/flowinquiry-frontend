import { z } from "zod";

export const WorkflowDTOSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(1),
  requestName: z.string().min(1),
  description: z.string().nullable(),
  isGlobal: z.boolean(),
});

export type WorkflowDTO = z.infer<typeof WorkflowDTOSchema>;
