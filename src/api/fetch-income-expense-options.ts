import { api } from "@/services/api";

export interface IncomeExpense {
  id: number
  name: string;
}

export async function fetchIncomeExpenseOptions(): Promise<IncomeExpense[]> {
  const response = await api.get(
    `/finance/income-expense-options`
  );
  return response.data;
}