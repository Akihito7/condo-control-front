import { api } from "@/services/api";


export interface DelinquencyMonthlyEvolution {
  month: string;
  delinquencyPercentage: number;
}

export async function fetchDelinquencyMonthlyEvolution(date: string): Promise<DelinquencyMonthlyEvolution[]> {
  const response = await api.get(`finance/delinquency/monthly-evolution/${date}`);
  return response.data;
}