import { api } from "@/services/api";

export async function fetchOptionsIssuesOpeningCalls() {
  const response = await api("/communication/opening-calls/options/issues");
  return response.data
}