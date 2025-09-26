import { api } from "@/services/api";

interface FetchChartRevenueFixedVsVariableProps {
  condominiumId: number;
  startDate: string;
  endDate: string;
}

export interface Chart {
  name: string;
  value: number;
  id: number;
  totalAmount: number;
}
export async function fetchChartRevenueFixedVsVariable({
  condominiumId,
  startDate,
  endDate
}: FetchChartRevenueFixedVsVariableProps): Promise<Chart[]> {
  const response = await api.get(`indicators/chart/revenue/fixed-vs-variable/${condominiumId}/${startDate}/${endDate}`);
  return response.data;
}