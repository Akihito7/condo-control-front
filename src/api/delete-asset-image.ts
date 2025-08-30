import { api } from "@/services/api"

export interface DeleteAssetImageProps {
  formData: FormData;
  assetId: number
}

export async function deleteAssetImage({
  assetId,
}: DeleteAssetImageProps) {
  const response = await api.delete(`structure/assets/image/${assetId}`);
  return response.data;
}