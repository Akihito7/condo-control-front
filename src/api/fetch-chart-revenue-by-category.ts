import { api } from "@/services/api";

interface FetchChartRevenueByCategoryProps {
  condominiumId: number;
  startDate: string;
  endDate: string;
}

interface Chart {
  name: string;
  value: number;
  id: number;
}
export async function fetchChartRevenueByCategory({
  condominiumId,
  startDate,
  endDate
}: FetchChartRevenueByCategoryProps): Promise<Chart[]> {
  const response = await api.get(`indicators/chart/revenue-by-category/${condominiumId}/${startDate}/${endDate}`);
  const data = response.data;
  return data
}