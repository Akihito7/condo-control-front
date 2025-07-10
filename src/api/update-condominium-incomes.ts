import { api } from "@/services/api";

export interface UpdateCondominiumIncomesProps {
  date: string;
  income: string | undefined
  targetIncome: string | undefined
  condominiumId: number
}

export async function updateCondominiumIncomes({
  date,
  income,
  targetIncome,
  condominiumId
}: UpdateCondominiumIncomesProps) {

  const response = await api.patch(
    `/finance/condominium/incomes/${condominiumId}/${date}`, {
    income,
    targetIncome
  }
  );
  return response.data;
}