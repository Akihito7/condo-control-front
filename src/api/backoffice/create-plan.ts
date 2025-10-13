import { CreatePlanFormValues } from "@/app/(protected)/backoffice/plans/create/page";
import { api } from "@/services/api";

export async function createPlan(data: CreatePlanFormValues) {
  const response = await api.post('backoffice/plans', data);
  return response.data;
}