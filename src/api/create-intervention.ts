
import { api } from "@/services/api"

interface CreateInterventionParams<T> {
  condominiumId: number;
  data: T
}
export async function createIntervention<T>({
  condominiumId,
  data
}: CreateInterventionParams<T>) {
  const response = await api.post(`structure/maintenance-backlog/create/${condominiumId}`, data);
}