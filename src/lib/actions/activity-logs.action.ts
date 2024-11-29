"use server";

import { get } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { ActivityLogDTO } from "@/types/activity-logs";
import { EntityType, PageableResult } from "@/types/commons";

export const getActivityLogs = async (
  entityType: EntityType,
  entityId: number,
  page: number,
  displayNumber = 10,
) => {
  return get<PageableResult<ActivityLogDTO>>(
    `${BACKEND_API}/api/activity-logs?entityType=${entityType}&&entityId=${entityId}&&page=${page - 1}&&size=${displayNumber}&&sortBy=createdAt&&sortDirection=desc`,
  );
};
