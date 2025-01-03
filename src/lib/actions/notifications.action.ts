import { get, post } from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { NotificationDTO, PageableResult } from "@/types/commons";

export async function getUnReadNotificationsByUserId(
  userId: number,
  setError?: (error: HttpError | string | null) => void,
) {
  return get<Array<NotificationDTO>>(
    `/api/notifications/unread?userId=${userId}`,
    setError,
  );
}

export async function markNotificationsAsRead(
  notificationIds: number[],
  setError?: (error: HttpError | string | null) => void,
): Promise<void> {
  return post(`/api/notifications/mark-read`, {
    notificationIds: notificationIds,
    setError,
  });
}

export async function getUserNotifications(
  userId: number,
  page: number,
  displayNumber = 10,
  setError?: (error: HttpError | string | null) => void,
) {
  return get<PageableResult<NotificationDTO>>(
    `/api/notifications/user/${userId}?page=${page}&size=${displayNumber}&sort=createdAt,desc`,
    setError,
  );
}
