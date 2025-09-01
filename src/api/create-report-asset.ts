import { ReportFormData } from "@/app/(protected)/structure/asset-management/modal-report";
import { api } from "@/services/api";

interface CreateReportAssetProps {
  formData: FormData,
  assetId: number,
}

export async function createReportAsset({
  formData,
  assetId
}: CreateReportAssetProps) {
  const response = await api.post(`structure/assets/report/${assetId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = response.data;
  return data;
}