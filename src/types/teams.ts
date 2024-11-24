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
  teamName: z.string().nullable().optional(),
  workflowId: z.number().nullable(),
  workflowName: z.string().nullable().optional(),
  priority: z.enum(["Critical", "High", "Medium", "Low", "Trivial"]),
  requestUserId: z.number().nullable(),
  requestUserName: z.string().nullable().optional(),
  requestUserImageUrl: z.string().nullable().optional(),
  assignUserId: z.number().nullable().optional(),
  assignUserName: z.string().nullable().optional(),
  assignUserImageUrl: z.string().nullable().optional(),
  requestTitle: z.string(),
  requestDescription: z.string().nullable(),
  createdDate: z.string().optional(),
  currentState: z.string().optional(),
});

export type TeamRequestDTO = z.infer<typeof TeamRequestDTOSchema>;
