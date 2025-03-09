import { z } from "zod";

export type ProjectStatus = "Active" | "Closed";

export const ProjectSchema = z.object({
  id: z.number().int().positive().nullish(), // Nullable for cases where it's not set yet
  name: z.string().min(1).max(255),
  description: z.string().nullable(),
  teamId: z.number().int().positive(),
  status: z.enum(["Active", "Closed", "Cancelled"]).default("Active"),
  startDate: z.preprocess((value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value;
  }, z.date().nullish()),
  endDate: z.preprocess((value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value;
  }, z.date().nullish()),
  createdBy: z.number().int().positive().nullish(),
  createdAt: z.string().datetime().nullish(),
  modifiedBy: z.number().int().positive().nullish(),
  modifiedAt: z.string().datetime().nullish(),
});

export type ProjectDTO = z.infer<typeof ProjectSchema>;
