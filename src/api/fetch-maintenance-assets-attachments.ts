import { api } from "@/services/api";

export async function fetchMaintenanceAssetsAttachments(assetId: number) {
  const response = await api.get(`structure/maintenance-management/assets/attchaments/${assetId}`);
  return response.data;
}