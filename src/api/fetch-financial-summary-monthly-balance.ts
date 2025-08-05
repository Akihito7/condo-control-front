import { api } from "@/services/api";

interface FetchFinancialSummaryMonthlyBalanceProps {
  condominiumId: number;
  year: string;
}


interface MonthlyBalanace {
  month: string, income: number, expense: number, total: number
}

export async function fetchFinancialSummaryMonthlyBalance({
  condominiumId,
  year
}: FetchFinancialSummaryMonthlyBalanceProps): Promise<MonthlyBalanace[]> {
  const response = await api.get(`indicators/chart/financial-summary/monthly-balance/${condominiumId}/${year}`);
  const data = response.data;
  return data
}