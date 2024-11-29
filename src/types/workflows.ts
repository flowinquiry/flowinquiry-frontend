import { z } from "zod";

export const WorkflowDTOSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(1),
  requestName: z.string().min(1),
  description: z.string().nullable(),
  isGlobal: z.boolean(),
});

export type WorkflowDTO = z.infer<typeof WorkflowDTOSchema>;

export const WorkflowStateDTOSchema = z.object({
  id: z.number().optional(),
  workflowId: z.number(),
  stateName: z.string(),
  isInitial: z.boolean(),
  isFinal: z.boolean(),
});

export type WorkflowStateDTO = z.infer<typeof WorkflowStateDTOSchema>;
