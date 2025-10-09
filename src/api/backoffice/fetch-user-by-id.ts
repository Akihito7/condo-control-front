import { api } from "@/services/api";
import { User } from "./fetch-users";

export async function fetchUserById(userId: string): Promise<User> {
  const response = await api.get(`backoffice/users/${userId}`)
  return response.data;
}