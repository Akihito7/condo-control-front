import { api } from "@/services/api";

export async function forgetPassword({ email }: { email: string }) {
  await api.post('auth/forget-password', { email })
}