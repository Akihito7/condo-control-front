import { FormUpdatePlanValues } from "@/app/(protected)/backoffice/plans/edit/[planId]/form-edit-plan";
import { api } from "@/services/api";

export async function updatePlan(planId: number, data: FormUpdatePlanValues) {
  const response = await api.put(`backoffice/plans/${planId}`, data);
  return response.data;
}