import { api } from "@/services/api";

interface EventData {
  monthName: string,
  totalRevenue: number,
  totalOccupation: string
}
export async function fetchManagementSpacesMontlhyRevenueAndOccupation(date: string): Promise<EventData[]> {
  const response = await api.get(`structure/management-spaces/indicators/monthly-revenue-and-occupation/${date}`);
  return response.data
}