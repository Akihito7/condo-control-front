import { api } from "@/services/api";
import { boolean, number } from "zod/v4";


export interface Plan {
  id: number;
  isCustom: boolean;
  name: string;
  description: string | null
  createdAt: string | null
  planPage: PlanPage[]
  price: number;
}

export interface PlanPage {
  id: number
  pageId: number
  planId: number;
  updatedAt: string | null
  createdAt: string | null
}
export async function fetchPlanById(planId: string): Promise<Plan> {
  const response = await api.get(`backoffice/plans/${planId}`);
  return response.data
}
