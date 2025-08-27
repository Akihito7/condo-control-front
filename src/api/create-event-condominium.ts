import { api } from "@/services/api";

interface CreateEventCondominiumProps {
  data: any
}
export async function createEventCondominium({ data }: CreateEventCondominiumProps) {
  const response = await api.post('communication/schedule', data);
  return response.data
}