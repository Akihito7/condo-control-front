import { api } from "@/services/api";


interface CreateMaintenanceManagementAssetsProps {
  form: FormData
}
export async function createMaintenanceManagementAssets({ form }: CreateMaintenanceManagementAssetsProps) {
  const reponse = await api.post('structure/maintenance-management/assets/create', form)
}