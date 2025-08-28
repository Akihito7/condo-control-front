import { api } from "@/services/api";

export async function updateEventCondominium(data: any) {
  const response = await api.put(`communication/schedule/${data.id}`, data);
  return response.data
}