import { AssetFormData } from "@/app/(protected)/structure/asset-management/modal-action-asset";
import { api } from "@/services/api"

interface UpdateAssetProps {
  assetId: number,
  data: AssetFormData

}
export async function updateAsset({
  assetId,
  data
}: UpdateAssetProps) {
  const response = await api.put(`structure/assets/${assetId}`, data);
  return response.data
}