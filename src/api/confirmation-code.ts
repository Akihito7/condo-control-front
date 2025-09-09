import { api } from "@/services/api";

export async function confirmationCode(code: string) {
  const response = await api.put(`communication/delivery/mark-as-delivered/confirmation-code/${code}`)
  return response.data;
}