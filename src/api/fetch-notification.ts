import { api } from "@/services/api";


export interface Notification {
  id: number;
  title: string;
  description: string;
  createdBy: number;
  createdAt: string;
  read: boolean;
  toUserId?: number
  condominiumId: number;
}

export async function fetchNotification(): Promise<Notification[]> {
  const response = await api.get('structure/notifications');
  return response.data
}