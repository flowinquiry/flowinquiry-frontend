import { z } from "zod";

export const TeamDTOSchema = z.object({
  id: z.number().nullish(),
  name: z.string().min(1),
  logoUrl: z.string().nullish(),
  slogan: z.string().nullish(),
  description: z.string().nullish(),
  organizationId: z.number().nullish(),
  usersCount: z.number().nullish(),
});

export type TeamDTO = z.infer<typeof TeamDTOSchema>;

export type TeamRole = "Manager" | "Member" | "Guest" | "None";

export type TeamRequestPriority =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Trivial";

export const TeamRequestDTOSchema = z.object({
  id: z.number().optional(),
  teamId: z.number().nullable(),
  teamName: z.string().nullish(),
  workflowId: z.number().nullable(),
  workflowName: z.string().nullish(),
  workflowRequestName: z.string().nullish(),
  priority: z.enum(["Critical", "High", "Medium", "Low", "Trivial"]),
  requestUserId: z.number().nullable(),
  requestUserName: z.string().nullish(),
  requestUserImageUrl: z.string().nullish(),
  assignUserId: z.number().nullish(),
  assignUserName: z.string().nullish(),
  assignUserImageUrl: z.string().nullish(),
  requestTitle: z.string(),
  requestDescription: z.string().min(1),
  createdDate: z.string().optional(),
  lastUpdatedTime: z.date().nullish(),
  estimatedCompletionDate: z.string().nullish(),
  actualCompletionDate: z.string().nullish(),
  currentState: z.string().optional(),
});

export type TeamRequestDTO = z.infer<typeof TeamRequestDTOSchema>;
