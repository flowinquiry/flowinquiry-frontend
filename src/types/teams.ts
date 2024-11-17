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
