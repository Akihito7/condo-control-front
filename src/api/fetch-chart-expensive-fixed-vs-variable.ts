import { api } from "@/services/api";

interface FetchChartExpensiveFixedVsVariableProps {
  condominiumId: number;
  startDate: string;
  endDate: string;
}

interface Chart {
  name: string;
  value: number;
  id: number;
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