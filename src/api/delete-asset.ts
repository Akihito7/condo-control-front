import { api } from "@/services/api";

export async function deleteAsset(assetId: number) {
  const response = await api.delete(`structure/assets/${assetId}`);
  return response.data
}