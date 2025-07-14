import { api } from "@/services/api";

interface DeleteDelinquencyRegisterProps {
  delinquencyId: number
}
export async function deleteDelinquencyRegister({ delinquencyId }: DeleteDelinquencyRegisterProps) {
  await api.delete(`finance/delinquency/${delinquencyId}`)
}