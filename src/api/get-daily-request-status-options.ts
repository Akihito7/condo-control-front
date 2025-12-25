import { api } from "@/services/api";
import { Option } from "./fetch-work-areas";

export async function getDailyRequestStatusOptions(): Promise<Option[]> {
  const response = await api.get("structure/daily-request/options/status");
  return response.data;
}
