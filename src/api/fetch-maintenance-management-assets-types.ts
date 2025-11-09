import { api } from "@/services/api";


export interface Type {
  name: string;
  condominiumId: number;
  id: number;
}
export async function fetchMaintenanceManagementAssetsTypes(): Promise<Type[]> {
  const response = await api.get('structure/maintenance-management/assets/types');
  return response.data;
}