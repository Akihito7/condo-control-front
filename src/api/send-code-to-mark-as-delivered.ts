import { api } from "@/services/api";

export async function sendCodeToMarkAsDelivered(deliveryId: number) {
  const response = await api.post(`communication/delivery/mark-as-delivery/send-code/${deliveryId}`);
  return response.data;
}