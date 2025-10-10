import { api } from "@/services/api";


export interface Plan {
  createdAt: string | null;
  description: string;
  id: number;
  isCustom: boolean
  name: string
  price: number;
  updatedAt: null
}

export async function fetchPlans(): Promise<Plan[]> {
  const response = await api.get('backoffice/plans')
  return response.data;
}