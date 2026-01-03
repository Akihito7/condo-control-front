import { api } from "@/services/api";

export async function fetchSecurityUnits() {
  const response = await api.get("security/units");
  return response.data;
}
