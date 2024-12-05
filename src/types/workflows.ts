import { z } from "zod";

export type WorkflowVisibility = "PUBLIC" | "PRIVATE" | "TEAM";

export const WorkflowDTOSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(1),
  requestName: z.string().min(1),
  description: z.string().nullable(),
  ownerId: z.number().nullish(),
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

export const WorkflowTransitionSchema = z.object({
  id: z.number().int().positive().optional(),
  workflowId: z.number().int().positive(),
  sourceStateId: z.number().int().positive(),
  targetStateId: z.number().int().positive(),
  eventName: z.string().min(1),
  slaDuration: z.number().nullable(),
  escalateOnViolation: z.boolean(),
});

export type WorkflowTransitionDTO = z.infer<typeof WorkflowTransitionSchema>;

export interface WorkflowDetailedDTO extends WorkflowDTO {
  ownerName: string;
  states: WorkflowStateDTO[];
  transitions: WorkflowTransitionDTO[];
}
