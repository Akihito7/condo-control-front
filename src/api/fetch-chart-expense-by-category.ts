import { api } from "@/services/api";

interface FetchChartExpenseByCategoryProps {
  condominiumId: number;
  startDate: string;
  endDate: string;
}

interface Chart {
  name: string;
  value: number;
  id: number;
}
export async function fetchChartExpenseByCategory({
  condominiumId,
  startDate,
  endDate
}: FetchChartExpenseByCategoryProps): Promise<Chart[]> {
  const response = await api.get(`indicators/chart/expense-by-category/${condominiumId}/${startDate}/${endDate}`);
  const data = response.data;
  return data
}