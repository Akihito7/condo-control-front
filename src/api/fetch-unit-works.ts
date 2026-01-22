import { api } from "@/services/api";

export interface WorkUnit {
  id: number;
  condominiumId: number;
  blockId: number;
  apartamentId: number;
  statusId: number;
  forecastDate: string;
  forecastEndDate: string;
  description: string;
  hasArtRrt: boolean;
  observations: string;
  createdAt: string;
}

export async function fetchUnitWorks(): Promise<WorkUnit[]> {
  const response = await api.get(`structure/unit-works/`);
  return response.data;
}
