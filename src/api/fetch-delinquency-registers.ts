import { api } from "@/services/api";

export type Delinquency = {
  id: number;
  condominiumId: number;
  apartamentId: number;
  categoryId: number;
  dueDate: string;
  amount: number;
  amountPaid: number | null;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  observations: string | null;
  categoryName: string,
  daysLate: number
};

interface FetchDelinquencyRegistersProps {
  condominiumId: number;
  date: string;
}
export async function fetchDeliquencyRegisters({
  condominiumId,
  date

}: FetchDelinquencyRegistersProps): Promise<Delinquency[]> {
  const response = await api.get(`/finance/delinquency/${condominiumId}/${date}`)
  return response.data;
}