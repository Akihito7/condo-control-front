import { api } from "@/services/api";

export interface Option {
  id: number;
  name: string
}

export async function fetchWorkAreas(): Promise<Option[]> {
  const response = await api.get('structure/work-areas/options');
  return response.data
}