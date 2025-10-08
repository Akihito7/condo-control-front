import { api } from "@/services/api";

export async function fetchSupabasePublicUrl(fullPath: string) {
  const response = await api.post(`finance/supabase/publicurl`, { fullPath })
  return response.data;
}