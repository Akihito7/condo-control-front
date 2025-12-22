import { api } from "@/services/api";

export async function fetchUnitWorksStatus() {
  const response = await api.get("structure/unit-works/status");
  return response.data;
}
