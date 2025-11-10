import { api } from "@/services/api";

export async function deleteMaintenanceAsset(assetId: number) {
  await api.put(`structure/maintenance-management/assets/${assetId}`)
}