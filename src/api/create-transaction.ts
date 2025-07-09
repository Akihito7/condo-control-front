import { api } from "@/services/api";

export interface CreateTransactionProps {
  dueDate: Date
  recordTypeId: number
  categoryId: number
  apartmentId: number
  paymentMethodId: number
  paymentStatusId: number
  notes: string | undefined
  recurring: boolean
  type: number
  paymentDate: number | undefined,
}
export async function createTransaction(data: CreateTransactionProps) {
  await api.post('finance/create-transaction', data);
}