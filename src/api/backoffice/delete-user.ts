import { api } from "@/services/api";

export async function deleteUser(userId: number) {
  const response = await api.delete(`backoffice/user/${userId}`);
  return response.data;
}