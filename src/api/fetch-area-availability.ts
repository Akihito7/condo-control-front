import { api } from "@/services/api";


export interface AreaAvailability {
  id: number;
  condominiumAreaId: number;
  name: string;
  startHour: string;
  endHour: string;
  createdAt: string;
}
export async function fetchAreaAvailability(areaId: string): Promise<AreaAvailability[]> {
  const response = await api.get(`structure/maintenance-backlog/options/area-availability/${areaId}`);
  return response.data;
}