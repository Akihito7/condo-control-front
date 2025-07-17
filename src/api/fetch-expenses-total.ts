import { api } from "@/services/api";

interface FetchExpenseTotalProps {
  startDate: string;
  endDate: string;
  condominiumId: number;
}


interface FetchExpenseTotalResponse {
  totalExpenses: number
}

export async function fetchExpensesTotal({
  condominiumId,
  startDate,
  endDate
}: FetchExpenseTotalProps): Promise<FetchExpenseTotalResponse> {
  const response = await api.get(
    `/finance/expenses-total/${condominiumId}/${startDate}/${endDate}`
  );
  return response.data;
}