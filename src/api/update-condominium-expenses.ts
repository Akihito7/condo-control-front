import { api } from "@/services/api";

export interface UpdateCondominiumExpensesProps {
  date: string;
  expenses: string | undefined
  targetExpenses: string | undefined
  condominiumId: number
}

export async function updateCondominiumExpenses({
  date,
  expenses,
  targetExpenses,
  condominiumId
}: UpdateCondominiumExpensesProps) {

  const response = await api.patch(
    `/finance/condominium/expenses/${condominiumId}/${date}`, {
    expenses,
    targetExpenses
  }
  );
  return response.data;
}