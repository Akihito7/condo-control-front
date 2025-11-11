import { api } from "@/services/api";

export async function deleteMaintenanceAttachment(attchamentId: number) {
  await api.delete(`structure/maintenance-management/attchaments/${attchamentId}`)
}