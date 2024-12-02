import { EntityType } from "@/types/commons";

export interface ActivityLogDTO {
  id: number;
  entityType: EntityType;
  entityName: string;
  entityId: number;
  content: string;
  createdAt: string; // Use ISO string format for Instant
  createdById: number;
  createdByName: string;
  createdByImageUrl: string;
}
