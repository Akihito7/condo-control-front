import { api } from "@/services/api";

export async function resetPassword({ password, code }: { password: string, code: string }) {
  const response = await api.patch('auth/reset-password', {
    password, code
  });
  return response.data;
}