import { api } from "@/services/api";


interface Type {
  name: string;
  condominiumId: number;
}
export async function maintenanceManagementAssetsTypesCreate(name: string): Promise<Type> {
  const response = await api.post('structure/maintenance-management/assets/types/create', { name });
  return response.data;
}