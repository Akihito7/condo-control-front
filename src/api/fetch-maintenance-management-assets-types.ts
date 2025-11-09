import { api } from "@/services/api";
export interface Type {
  id: number;
  condominiumId: number;
  name: string;
}
export async function fetchMaintenanceManagementAssetsTypes(): Promise<Type[]> {
  const response = await api.get('structure/maintenance-management/assets/types');
  return response.data;
}