import { api } from "@/services/api";

export async function deleteMaintenanceAssetsAttachment(attchamentId: number) {
  await api.delete(`structure/maintenance-management/assets/attchaments/${attchamentId}`)
}