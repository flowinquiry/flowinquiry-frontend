import { get } from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { ActivityLogDTO } from "@/types/activity-logs";
import { EntityType, PageableResult } from "@/types/commons";

export const getActivityLogs = async (
  entityType: EntityType,
  entityId: number,
  page: number,
  displayNumber = 10,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<PageableResult<ActivityLogDTO>>(
    `/api/activity-logs?entityType=${entityType}&entityId=${entityId}&page=${page}&size=${displayNumber}&sort=createdAt,desc`,
    setError,
  );
};

export const getUserActivities = async (
  userId: number,
  page: number,
  displayNumber = 10,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<PageableResult<ActivityLogDTO>>(
    `/api/activity-logs/user/${userId}?page=${page}&size=${displayNumber}&sort=createdAt,desc`,
    setError,
  );
};
