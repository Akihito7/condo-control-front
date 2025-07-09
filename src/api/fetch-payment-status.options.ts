import { api } from "@/services/api";

export interface PaymentStatus {
  id: number
  name: string;
}

export async function fetchPaymentStatusOptions(): Promise<PaymentStatus[]> {
  const response = await api.get(
    `/finance/payment-status-options`
  );
  return response.data;
}