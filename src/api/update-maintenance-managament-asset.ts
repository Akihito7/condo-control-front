import { api } from "@/services/api";

interface CreateMaintenanceManagementAssetsProps {
  assetId: number;
  data: any;
}
export async function updateMaintenanceManagementAssets({
  assetId,
  data,
}: CreateMaintenanceManagementAssetsProps) {
  const reponse = await api.put(
    `structure/maintenance-management/assets/update/${assetId}`,
    data,
  );
}
