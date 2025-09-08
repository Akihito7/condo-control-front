import { api } from "@/services/api";

export interface FetchDistruibitionByType {
  startDate: string;
  endDate: string;
}


export interface ChartDistribuition {
  categoryId: 1,
  categoryName: 'Taxa Condominial',
  categoryPercentage: 50,
  categoryCount: 1
}
export async function fetchDistruibitionByType({
  startDate,
  endDate
}: FetchDistruibitionByType): Promise<ChartDistribuition[]> {
  const response = await api.get(`finance/delinquency/chart/distribution-by-type/${startDate}/${endDate}`);
  return response.data;
}