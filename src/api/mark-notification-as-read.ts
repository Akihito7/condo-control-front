import { api } from "@/services/api";

export async function markNotificationAsRead(notificationId: number) {
  await api.patch(`structure/notifications/${notificationId}`);
}