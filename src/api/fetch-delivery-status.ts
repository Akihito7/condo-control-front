import { api } from "@/services/api";

interface Status {
  id: number;
  name: string
}

export async function fetchDeliveryStatus(): Promise<Status[]> {
  const response = await api.get("/communication/delivery/status-options");
  return response.data;
}