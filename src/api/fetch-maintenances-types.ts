import { api } from "@/services/api";

export interface TypesOption {
  id: number;
  name: string;
}

export async function fetchMaintenancesTypes(): Promise<TypesOption[]> {
  const response = await api.get('structure/maintenance-backlog/types/options')
  return response.data;
}