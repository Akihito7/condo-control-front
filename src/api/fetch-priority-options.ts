import { api } from "@/services/api";


export interface PriorityOption {
  id: number;
  name: string;
}

export async function fetchPriorityOptions(): Promise<PriorityOption[]> {
  const response = await api.get('structure/maintenance-backlog/priority/options');
  return response.data;
}