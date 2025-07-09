import { api } from "@/services/api";

export interface PaymentMethod {
  id: number
  name: string;
}

export async function fetchPaymentMethodOptions(): Promise<PaymentMethod[]> {
  const response = await api.get(
    `/finance/payment-methods-options`
  );
  return response.data;
}