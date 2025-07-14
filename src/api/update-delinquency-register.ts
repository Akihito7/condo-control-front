import { api } from "@/services/api"

interface UpdateDelinquencyRegiserProps {
  delinquencyId: string
  paymentDate?: string
  categoryId: number,
  amountPaid?: string,
  amount: string,
  dueDate: string,
  apartamentId: number
}
export async function updateDelinquencyRegister({
  delinquencyId,
  amount,
  apartamentId,
  dueDate,
  categoryId,
  amountPaid,
  paymentDate
}: UpdateDelinquencyRegiserProps) {
  await api.patch(`finance/delinquency/update/${delinquencyId}`, {
    amount,
    amountPaid,
    apartamentId,
    categoryId,
    dueDate,
    paymentDate
  })
}