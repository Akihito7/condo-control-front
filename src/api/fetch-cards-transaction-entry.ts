import { api } from "@/services/api";

interface FetchCardsTransactionEntry {
  startDate: string;
  endDate: string;
  condominiumId: number;
}


interface FetchCardsTransactionEntryResponse {
  totalIncome: number,
  totalExpenses: number,
  balance: number
  incomeTarget: number | undefined
  expensesTarget: number | undefined
  isSameMonth: boolean
}

export async function fetchCardsTransactionEntry({
  condominiumId,
  startDate,
  endDate
}: FetchCardsTransactionEntry): Promise<FetchCardsTransactionEntryResponse> {
  const response = await api.get(
    `/finance/revenue-total/${condominiumId}/${startDate}/${endDate}`
  );
  return response.data;
}