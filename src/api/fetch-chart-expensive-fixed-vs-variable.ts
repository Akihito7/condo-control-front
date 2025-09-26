import { api } from "@/services/api";

interface FetchChartExpensiveFixedVsVariableProps {
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
export async function fetchChartExpensiveFixedVsVariable({
  condominiumId,
  startDate,
  endDate
}: FetchChartExpensiveFixedVsVariableProps): Promise<Chart[]> {
  const response = await api.get(`indicators/chart/expensive/fixed-vs-variable/${condominiumId}/${startDate}/${endDate}`);
  const data = response.data;
  return data
}