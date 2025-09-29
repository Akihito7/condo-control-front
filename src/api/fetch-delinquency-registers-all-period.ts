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
}
export async function fetchDeliquencyRegistersAllPeriod({
  condominiumId,
}: FetchDelinquencyRegistersProps): Promise<Delinquency[]> {
  const response = await api.get(`/finance/delinquency/${condominiumId}/all-period`)
  return response.data;
}