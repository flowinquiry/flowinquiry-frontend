import { z } from "zod";

export type WorkflowVisibility = "PUBLIC" | "PRIVATE" | "TEAM";

export const WorkflowDTOSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  requestName: z.string().min(1),
  description: z.string().nullable(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "TEAM"]),
  ownerId: z.number().nullish(),
  ownerName: z.string().nullish(),
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
  id: z.number().optional(),
  workflowId: z.number(),
  sourceStateId: z.number().nullish(),
  targetStateId: z.number().nullish(),
  eventName: z.string().min(1),
  slaDuration: z.number().nullish(),
  escalateOnViolation: z.boolean(),
});

export type WorkflowTransitionDTO = z.infer<typeof WorkflowTransitionSchema>;

export const WorkflowDetailSchema = WorkflowDTOSchema.merge(
  z.object({
    states: z.array(WorkflowStateDTOSchema),
    transitions: z.array(WorkflowTransitionSchema),
  }),
);

export type WorkflowDetailDTO = z.infer<typeof WorkflowDetailSchema>;
