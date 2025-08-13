import { InterventionFormData } from "@/app/(protected)/structure/maintenance-backlog/modal-action-intervation";
import { api } from "@/services/api";

interface UpdateInterventionProps {
  interventionId: number;
  data: InterventionFormData
}
export async function updateIntervention({
  interventionId,
  data
}: UpdateInterventionProps) {
  await api.put(`structure/maintenance-backlog/update/${interventionId}`, data);
}