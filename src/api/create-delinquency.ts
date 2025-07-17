import { api } from "@/services/api";

interface CreateDelinquencyProps {
  condominiumId: number;
  dueDate: Date;
  paymentDate?: Date;
  amount: string;
  amountPaid?: string;
  categoryId: string;
  apartamentId: string;
}

export async function createDelinquency({
  condominiumId,
  amount,
  apartamentId,
  categoryId,
  dueDate,
  amountPaid,
  paymentDate
}: CreateDelinquencyProps) {
  const response = await api.post(`/finance/delinquency/create/${condominiumId}`, {
    amount,
    apartamentId,
    categoryId,
    dueDate,
    amountPaid,
    paymentDate
  });
  const data = response.data;
}