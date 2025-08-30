import { api } from "@/services/api"

export interface UpdateAssetImageProps {
  formData: FormData;
  assetId: number
}

export async function updateAssetImage({
  assetId,
  formData
}: UpdateAssetImageProps) {
  const response = await api.patch(`structure/assets/image/${assetId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}