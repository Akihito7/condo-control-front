import { api } from "@/services/api";

export async function deleteSpaceEvent(eventId: number) {
  await api.delete(`structure/management-spaces/events/${eventId}`)
} 