import { z } from "zod";

export const AuthorityDTOSchema = z
  .object({
    name: z.string().default(""),
    descriptiveName: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9]+$/, {
        message:
          "Descriptive name must only contain letters (a-z, A-Z) and numbers (0-9), without spaces or special characters.",
      })
      .default("authority"),
    systemRole: z.boolean().default(false),
    description: z.string().default("").optional(),
    usersCount: z.onumber(),
  })
  .transform((data) => {
    // If `name` is null, set it to `descriptiveName`
    return {
      ...data,
      name:
        data.name === null || data.name === undefined || data.name === ""
          ? data.descriptiveName
          : data.name,
    };
  });

export type AuthorityDTO = z.infer<typeof AuthorityDTOSchema>;

export const AuthorityResourcePermissionDTOSchema = z.object({
  authorityName: z.string().nullish(),
  resourceName: z.string().nullish(),
  permission: z.string().nullish(),
});

export type AuthorityResourcePermissionDTO = z.infer<
  typeof AuthorityResourcePermissionDTOSchema
>;
