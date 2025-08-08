import { api } from "@/services/api";

export async function deleteGuestSpaceEvent(guestId: number) {
  await api.delete(`structure/management-spaces/events/guest/${guestId}`)
} 