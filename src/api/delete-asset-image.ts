import { api } from "@/services/api"

export interface DeleteAssetImageProps {
  assetId: number
}

export async function deleteAssetImage({
  assetId,
}: DeleteAssetImageProps) {
  const response = await api.patch(`structure/assets/image/delete/${assetId}`);
  return response.data;
}