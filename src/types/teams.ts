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
  teamId: z.number(),
  teamName: z.string().nullish(),
  workflowId: z.number(),
  workflowName: z.string().nullish(),
  workflowRequestName: z.string().nullish(),
  priority: z.enum(["Critical", "High", "Medium", "Low", "Trivial"]),
  requestUserId: z.number(),
  requestUserName: z.string().nullish(),
  requestUserImageUrl: z.string().nullish(),
  assignUserId: z.number().nullish(),
  assignUserName: z.string().nullish(),
  assignUserImageUrl: z.string().nullish(),
  requestTitle: z.string().min(1),
  requestDescription: z.string().min(1),
  createdDate: z.preprocess((value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value;
  }, z.date().nullish()),
  lastUpdatedTime: z.preprocess((value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value;
  }, z.date().nullish()),
  estimatedCompletionDate: z.preprocess((value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value;
  }, z.date().nullish()),
  actualCompletionDate: z.preprocess((value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value;
  }, z.date().nullish()),
  currentState: z.string().optional(),
  channel: z.string().nullish(),
});

export type TeamRequestDTO = z.infer<typeof TeamRequestDTOSchema>;

export type TicketChannel =
  | "Email"
  | "Phone"
  | "Web Portal"
  | "Chat"
  | "Social Media"
  | "In-person"
  | "Mobile App"
  | "API"
  | "System-generated"
  | "Internal";
