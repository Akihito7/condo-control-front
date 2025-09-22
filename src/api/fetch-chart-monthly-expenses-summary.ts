import { api } from "@/services/api";


export interface MonthlyExpense {
  id: number;
  nameMonth: string;             
  totalCoustMaintenances: number; 
  accumulatedBalance: number;   
}
export async function fetchChartMonthlyExpensesSummary(date: string): Promise<MonthlyExpense[]> {
  const response = await api.get(`structure/maintenace-backlog/monthly-expenses/summary/${date}`);
  return response.data;
}