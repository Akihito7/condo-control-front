import { api } from "@/services/api";

export type User = {
  id: number;
  name: string;
  is_super: boolean;
  email: string;
  phone: string;
  password: string;
  created_at: string | null;
  updated_at: string | null;
  condominiumId: number;
};


export async function fetchMe(): Promise<User> {
  const response = await api.get("auth/me");
  return response.data
}