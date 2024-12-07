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

export const WorkflowDetailSchema = z.object({
  name: z.string().min(1, { message: "Workflow name is required" }),
  requestName: z.string().min(1, { message: "Request name is required" }),
  description: z.string().nullable(),
  states: z.array(
    z.object({
      id: z.number().optional(),
      stateName: z.string().min(1, { message: "State name is required" }),
      isInitial: z.boolean(),
      isFinal: z.boolean(),
    }),
  ),
  transitions: z.array(
    z.object({
      id: z.number().optional(),
      sourceStateId: z.number().nullable(),
      targetStateId: z.number().nullable(),
      eventName: z.string().min(1, { message: "Event name is required" }),
      slaDuration: z.number().nullable(),
      escalateOnViolation: z.boolean(),
    }),
  ),
});

export type WorkflowDetailDTO = z.infer<typeof WorkflowDetailSchema>;
