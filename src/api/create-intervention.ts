import { InterventionFormData } from "@/app/(protected)/structure/maintenance-backlog/modal-action-intervation";
import { api } from "@/services/api"

interface CreateInterventionParams {
  condominiumId: number;
  data: InterventionFormData
}
export async function createIntervention({
  condominiumId,
  data
}: CreateInterventionParams) {
  const response = await api.post(`structure/maintenance-backlog/create/${condominiumId}`, data);
}