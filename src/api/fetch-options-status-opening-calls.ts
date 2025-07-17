import { api } from "@/services/api";

export async function fetchOptionsStatusOpeningCalls() {
  const response = await api("/communication/opening-calls/options/status");
  return response.data
}