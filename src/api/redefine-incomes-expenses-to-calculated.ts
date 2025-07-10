import { api } from "@/services/api";

interface RedefineIncomesExpensesToCalculatedProps {
  type: 'income' | 'expenses'
  date: string;
  condominiumId: number
}


export async function redefineIncomesExpensesToCalculated({
  type,
  date,
  condominiumId
}: RedefineIncomesExpensesToCalculatedProps) {
  await api.patch(`/finance/condominium/income-expenses/${condominiumId}/${date}?type=${type}`);
}