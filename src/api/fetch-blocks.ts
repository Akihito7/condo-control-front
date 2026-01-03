import { api } from "@/services/api";

export async function fetchBlocks() {
  const response = await api.get("security/blocks");
  return response.data
}
