import { z } from "zod";

import { authoritySchema } from "@/types/authorities";

export const userSchema = z.object({
  id: z.number().nullish(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().nullish(),
  title: z.string().nullish(),
  timezone: z.string().nullish(),
  lastLoginTime: z.string().nullish(),
  activated: z.boolean().optional(),
  imageUrl: z.string().nullish(),
  about: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  country: z.string().nullish(),
  managerId: z.number().nullish(),
  managerName: z.string().nullish(),
  authorities: z
    .array(z.union([authoritySchema, z.string()]))
    .transform((authorities) =>
      authorities.map((auth) =>
        typeof auth === "string"
          ? { name: auth, descriptiveName: auth, systemRole: false }
          : auth,
      ),
    ),
});

export type UserType = z.infer<typeof userSchema>;
