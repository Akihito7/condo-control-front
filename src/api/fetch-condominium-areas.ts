import { api } from "@/services/api";

export interface AreasOptions {
  id: number;
  name: string;
}

export async function fetchCondominiumAreas(condominiumId: number): Promise<AreasOptions[]> {
  const response = await api.get(`structure/maintenance-backlog/areas/options/${condominiumId}`);
  return response.data;
}