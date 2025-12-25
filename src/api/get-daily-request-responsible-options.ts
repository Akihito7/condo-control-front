import { api } from "@/services/api";
import { Option } from "./fetch-work-areas";

export async function getDailyRequestResponsibleOptions(): Promise<Option[]> {
  const response = await api.get("structure/daily-request/options/responsible");
  return response.data;
}
