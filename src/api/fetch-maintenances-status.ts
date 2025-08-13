import { api } from "@/services/api";

export interface MaintenanceStatusOption {
  id: number;
  name: string;
}

export async function fetchMaintenancesStatus(): Promise<MaintenanceStatusOption[]> {
  const response = await api.get("structure/maintenance-backlog/status/options")
  return response.data;
}