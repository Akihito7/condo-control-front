import { api } from "@/services/api";

export interface UpdateStatusAssetReportProps {
  reportId: number;
  status: string;
}

export async function updateStatusAssetReport({
  reportId,
  status
}: UpdateStatusAssetReportProps) {
  const response = await api.patch(`structure/assets/report/${reportId}`, { status });
  return response.data;
} 