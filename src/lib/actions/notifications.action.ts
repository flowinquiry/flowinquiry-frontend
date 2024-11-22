"use server";

import { get, post } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { NotificationType } from "@/types/commons";

export async function getUnReadNotificationsByUserId(userId: number) {
  return get<Array<NotificationType>>(
    `${BACKEND_API}/api/notifications/unread?userId=${userId}`,
  );
}

export async function markNotificationsAsRead(
  notificationIds: number[],
): Promise<void> {
  return post(`${BACKEND_API}/api/notifications/mark-read`, {
    notificationIds: notificationIds,
  });
}
