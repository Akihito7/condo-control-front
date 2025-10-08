import { api } from "@/services/api";

export interface CreateTransaction {
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

export interface CreateTransactionProps {
  form: FormData
}

export async function createTransaction({ form }: CreateTransactionProps) {
  await api.post('finance/create-transaction', form);
}