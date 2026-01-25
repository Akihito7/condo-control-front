import { api } from "@/services/api";

interface Maintenance {
  statusId: number;
  statusName: string;
  carriedOutDate: string | undefined;
}

export interface AssetMaintenanceReport {
  name: string;
  asset_id: number;
  total_maintenances: number;
  maintenances: Maintenance[];
}

 type AssetMaintenanceReportResponse = AssetMaintenanceReport[];
export async function getAsssetMaintenanacesDetails(): Promise<AssetMaintenanceReportResponse> {
  const response = await api.get("structure/assets-maintenances/details");
  return response.data;
}
