import { get, post } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { NotificationDTO, PageableResult } from "@/types/commons";

export async function getUnReadNotificationsByUserId(
  userId: number,
  setError?: (error: string | null) => void,
) {
  return get<Array<NotificationDTO>>(
    `${BACKEND_API}/api/notifications/unread?userId=${userId}`,
    setError,
  );
}

export async function markNotificationsAsRead(
  notificationIds: number[],
  setError?: (error: string | null) => void,
): Promise<void> {
  return post(`${BACKEND_API}/api/notifications/mark-read`, {
    notificationIds: notificationIds,
    setError,
  });
}

export async function getUserNotifications(
  userId: number,
  page: number,
  displayNumber = 10,
  setError?: (error: string | null) => void,
) {
  return get<PageableResult<NotificationDTO>>(
    `${BACKEND_API}/api/notifications/user/${userId}?page=${page}&size=${displayNumber}&sort=createdAt,desc`,
    setError,
  );
}
