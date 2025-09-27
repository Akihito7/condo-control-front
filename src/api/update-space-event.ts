import { Guest } from "@/app/(protected)/structure/management-of-common-spaces/moda-action-event";
import { api } from "@/services/api";

interface UpdateSpaceEventProps {
  eventId: number,
  guests: Guest[],
  periodSelectedIds: string[]
}

export async function updateSpaceEvent({
  eventId,
  guests,
  periodSelectedIds
}: UpdateSpaceEventProps) {
  const response = await api.put(`structure/management-spaces/events/${eventId}`, {
    guests,
    periodSelectedIds
  });
  return response.data
}