import { api } from "@/services/api";

export async function fetchUnitStatuses() {
  const response = await api.get("security/units/status");
  return response.data;
}
