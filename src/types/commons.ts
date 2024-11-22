/**
 * FW Commons data. Get the session data with code
 * const gwSession = useSession();
 */

type ISODateString = string;
export interface FwSession {
  user?: User;
  expires: ISODateString;
}

export interface User {
  id?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  createdDate?: ISODateString | null;
  lastModifiedDate?: ISODateString | null;
  authorities?: string[] | null;
}

export interface PageableResult<Entity> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Entity[];
}

export interface EntityValueDefinition {
  value: string;
  description?: string;
}

import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.number().nullable(),
  content: z.string(),
  createdAt: z.string(),
  userId: z.number(),
  isRead: z.boolean(),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
