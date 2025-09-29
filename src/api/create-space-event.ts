import { Guest } from "@/app/(protected)/structure/management-of-common-spaces/moda-action-event";
import { api } from "@/services/api";

interface CreateSpaceEventProps {
  eventDate: Date;
  apartmentId: string;
  condominiumAreaId: string;
  periodSelecteds: string[];
  guests: Guest[];
}

export async function createSpaceEvent(data: CreateSpaceEventProps) {
  await api.post('structure/management-spaces/events/create', {
    ...data
  });
}