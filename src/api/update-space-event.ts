import { Guest } from "@/app/(protected)/structure/management-of-common-spaces/moda-action-event";
import { api } from "@/services/api";

interface UpdateSpaceEventProps {
  eventId: number,
  startTime: string;
  endTime: string;
  guests: Guest[]
}

export async function updateSpaceEvent({
  eventId,
  guests,
  startTime,
  endTime
}: UpdateSpaceEventProps) {
  const response = await api.put(`structure/management-spaces/events/${eventId}`, {
    startTime,
    endTime,
    guests
  });
  return response.data
}