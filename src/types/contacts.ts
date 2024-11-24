import { z } from "zod";

export const ContactDTOSchema = z.object({
  id: z.number().nullish(),
  accountId: z.number().nullish(),
  accountName: z.string().nullish(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  postalCode: z.string().nullish(),
  country: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  position: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  status: z.string().min(1),
  notes: z.string().nullish(),
});

export type ConTactDTO = z.infer<typeof ContactDTOSchema>;

export type ContactSearchSchema = {
  account_id: number;
};
