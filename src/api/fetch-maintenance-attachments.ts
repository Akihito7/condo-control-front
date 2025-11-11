import { api } from "@/services/api";

export async function fetchMaintenanceAttachments(maintenanceId: number) {
  const response = await api.get(`structure/maintenance-management/attchaments/${maintenanceId}`);
  return response.data;
}