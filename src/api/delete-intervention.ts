import { api } from "@/services/api";

export async function deleteIntervention(intervationId: number) {
  await api.delete(`structure/maintenance-backlog/delete/${intervationId}`)
}