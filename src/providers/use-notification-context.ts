import { NotificationContext } from "@/contexts/notification-context";
import { useContext } from "react";

export function useNotificationContext() {
  const data = useContext(NotificationContext);

  if (!data) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }

  return data
}