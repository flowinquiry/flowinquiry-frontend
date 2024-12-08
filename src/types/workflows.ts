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
  slaDuration: z.preprocess(
    (value) => (value === "" || value === null ? null : Number(value)), // Convert empty string or null to null, otherwise convert to number
    z.number().nullable(), // Validate as nullable number
  ),
  escalateOnViolation: z.boolean(),
});

export type WorkflowTransitionDTO = z.infer<typeof WorkflowTransitionSchema>;

export const WorkflowDetailSchema = WorkflowDTOSchema.merge(
  z.object({
    states: z
      .array(WorkflowStateDTOSchema)
      .refine(
        (states) => states.filter((state) => state.isInitial).length <= 1,
        {
          message: "Only one state can be marked as initial.",
          path: ["states"], // Indicate the error relates to the `states` array
        },
      ),
    transitions: z.array(WorkflowTransitionSchema),
  }),
);

export type WorkflowDetailDTO = z.infer<typeof WorkflowDetailSchema>;
