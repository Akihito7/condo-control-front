import { api } from "@/services/api";

interface FetchChartRevenueFixedVsVariableProps {
  condominiumId: number;
  startDate: string;
  endDate: string;
}

interface Chart {
  name: string;
  value: number;
  id: number;
}
export async function fetchChartRevenueFixedVsVariable({
  condominiumId,
  startDate,
  endDate
}: FetchChartRevenueFixedVsVariableProps): Promise<Chart[]> {
  const response = await api.get(`indicators/chart/revenue/fixed-vs-variable/${condominiumId}/${startDate}/${endDate}`);
  return response.data;
}