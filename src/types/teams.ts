import { z } from "zod";

export const teamSchema = z.object({
  id: z.number().nullish(),
  name: z.string().min(1),
  logoUrl: z.string().nullish(),
  slogan: z.string().nullish(),
  description: z.string().nullish(),
  organizationId: z.number().nullish(),
  usersCount: z.number().nullish(),
});

export type TeamType = z.infer<typeof teamSchema>;

export type TeamRole = "Manager" | "Member" | "Guest" | "None";

export const TeamRequestDTOSchema = z.object({
  id: z.number().optional(),
  teamId: z.number().nullable(),
  teamName: z.string().nullable().optional(),
  workflowId: z.number().nullable(),
  workflowName: z.string().nullable().optional(),
  requestUserId: z.number().nullable(),
  requestUserName: z.string().nullable().optional(),
  assignUserId: z.number().nullable(),
  assignUserName: z.string().nullable().optional(),
  requestTitle: z.string(),
  requestDescription: z.string().nullable(),
  createdDate: z.string().optional(),
  currentState: z.string().optional(),
});

export type TeamRequestType = z.infer<typeof TeamRequestDTOSchema>;
