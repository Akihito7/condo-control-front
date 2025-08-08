import { api } from "@/services/api";

interface CreateSpaceEventProps {
  
}

export async function createSpaceEvent(data: any) {
  await api.post('structure/management-spaces/events/create', {
    ...data
  });
}