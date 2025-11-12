import { api } from "@/services/api";

export async function fetchSummaryMaintenance(date: string) {
  const response = await api.get(`structure/maintenances/summary/${date}`);
  console.log(response.data);
  return response.data;
}