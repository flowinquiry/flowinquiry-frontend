import { z } from "zod";

export type TeamRequestPriority =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Trivial";

// Define the TicketHealthLevel enum
export enum TicketHealthLevel {
  Excellent = "Excellent",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor",
  Critical = "Critical",
}

export const TeamRequestConversationHealthDTOSchema = z.object({
  id: z.number().optional(),
  teamRequestId: z.number().optional(),
  conversationHealth: z.number().optional(),
  cumulativeSentiment: z.number().optional(),
  totalMessages: z.number().optional(),
  totalQuestions: z.number().optional(),
  resolvedQuestions: z.number().optional(),
  healthLevel: z.nativeEnum(TicketHealthLevel).optional(),
});

export const TeamRequestDTOSchema = z.object({
  id: z.number().optional(),
  teamId: z.number().optional(),
  teamName: z.string().optional(),
  workflowId: z.onumber(),
  projectId: z.onumber(),
  workflowName: z.string().nullish(),
  workflowRequestName: z.string().nullish(),
  priority: z
    .enum(["Critical", "High", "Medium", "Low", "Trivial"])
    .default("Medium"),
  requestUserId: z.number().optional(),
  requestUserName: z.string().nullish(),
  requestUserImageUrl: z.string().nullish(),
  assignUserId: z.number().nullish(),
  assignUserName: z.string().nullish(),
  assignUserImageUrl: z.string().nullish(),
  currentStateId: z.number().nullish(),
  currentStateName: z.string().nullish(),
  requestTitle: z.string().default(""),
  requestDescription: z.string().default(""),
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
  numberAttachments: z.onumber(),
  numberWatchers: z.onumber(),
  conversationHealth: TeamRequestConversationHealthDTOSchema.optional(),
});

export type TeamRequestDTO = z.infer<typeof TeamRequestDTOSchema>;

export type TeamRequestConversationHealthDTO = z.infer<
  typeof TeamRequestConversationHealthDTOSchema
>;

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

export const ticketChannels = [
  "Email",
  "Phone",
  "Web Portal",
  "Chat",
  "Social Media",
  "In-person",
  "Mobile App",
  "API",
  "System-generated",
  "Internal",
] as const;

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
