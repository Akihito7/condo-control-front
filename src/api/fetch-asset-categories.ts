import { api } from "@/services/api";
import { Option } from "./fetch-work-areas";

export async function fetchAssetCategories(): Promise<Option[]> {
  const response = await api.get("structure/asset/category/options");
  return response.data;
}