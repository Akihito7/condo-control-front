import { api } from "@/services/api";


interface Asset {
  code: string;
  condominiumId: number;
  contact: string;
  createdAt: Date | null
  estimatedUsefulLife: string;
  id: number
  installationDate: string;
  remainingUsefulLife: string;
  maintenanceFrequency: string
  name: string;
  supplier: string;
  type: number
}
export async function fetchMaintenanceManagementAssets(): Promise<Asset[]> {
  const response = await api.get('structure/maintenance-management/assets')
  return response.data;
}