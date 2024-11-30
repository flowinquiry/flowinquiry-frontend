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

export interface TransitionItemDTO {
  fromState: string;
  toState: string;
  eventName: string;
  transitionDate: string; // Use ISO 8601 format for ZonedDateTime
  slaDueDate?: string; // Optional, since ZonedDateTime can be null
  status: string;
}

export interface TransitionItemCollectionDTO {
  ticketId: number;
  transitions: TransitionItemDTO[];
}
