import { z } from "zod";

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
  currentStateId: z.number().nullish(),
  currentStateName: z.string().nullish(),
  requestTitle: z.string().min(1),
  requestDescription: z.string().min(1),
  isNew: z.oboolean(),
  isCompleted: z.oboolean(),
  createdAt: z.preprocess((value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value;
  }, z.date().nullish()),
  modifiedAt: z.preprocess((value) => {
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

export type TicketDistributionDTO = {
  userId: number | null; // Null for unassigned tickets
  userName: string | null; // Null for unassigned tickets
  ticketCount: number;
};

export type PriorityDistributionDTO = {
  priority: TeamRequestPriority;
  ticketCount: number;
};

export interface TicketStatisticsDTO {
  totalTickets: number;
  pendingTickets: number;
  completedTickets: number;
}
