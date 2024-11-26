import { z } from "zod";

export const ActivityLogDTOSchema = z.object({
  id: z.number().nullish(),
  entityType: z.enum(["Team_Request", "Team"]),
  entityId: z.number(),
  content: z.string().min(1),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  createdById: z.number().nullish(),
  createdByName: z.string().nullish(),
  createdByImageUrl: z.string().nullish(),
});

export type ActivityLogDTO = z.infer<typeof ActivityLogDTOSchema>;
