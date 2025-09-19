import { api } from "@/services/api";

export interface UpdateRegisteProps {
  registerId: number;
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

export async function updateRegister({  
  registerId,
  ...data
}: UpdateRegisteProps) {
  const response = await api.put(
    `/finance/registers/${registerId}`, data
  );
  return response.data;
}