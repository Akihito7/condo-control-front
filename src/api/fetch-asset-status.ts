import { api } from "@/services/api";
import { Option } from "./fetch-work-areas";

export async function fetchAssetStatus(): Promise<Option[]> {
  const response = await api.get("structure/asset/status/options");
  return response.data;
}