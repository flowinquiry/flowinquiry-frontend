import { z } from "zod";

export const ActivityLogDTOSchema = z.object({
  id: z.number().nullish(),
  entityType: z.enum(["Team_Request", "Team"]),
  entityName: z.ostring(),
  entityId: z.number(),
  content: z.string().min(1),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export type ActivityLogDTO = z.infer<typeof ActivityLogDTOSchema>;
