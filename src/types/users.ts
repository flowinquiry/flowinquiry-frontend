import { z } from "zod";

export const UserDTOSchema = z.object({
  id: z.number().nullish(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().nullish(),
  title: z.string().nullish(),
  timezone: z.string().nullish(),
  lastLoginTime: z.string().nullish(),
  activated: z.boolean().optional(),
  status: z.enum(["ACTIVE", "PENDING"]).optional(),
  isDeleted: z.boolean().optional(),
  authorities: z.array(z.string()).optional(),
  imageUrl: z.string().nullish(),
  about: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  country: z.string().nullish(),
  managerId: z.number().nullish(),
  managerImageUrl: z.string().nullish(),
  managerName: z.string().nullish(),
});

export type UserDTO = z.infer<typeof UserDTOSchema>;

export const UserWithTeamRoleDTOSchema = z.object({
  id: z.number().nullable().optional(),
  email: z.string().email().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  teamId: z.number().nullable().optional(),
  teamRole: z.string().nullable().optional(),
});

export type UserWithTeamRoleDTO = z.infer<typeof UserWithTeamRoleDTOSchema>;
