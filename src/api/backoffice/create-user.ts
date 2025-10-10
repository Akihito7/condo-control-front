import { CreateUserFormValues } from "@/app/(protected)/backoffice/users/create/page";
import { api } from "@/services/api";

export async function createUser(user: CreateUserFormValues) {
  const response = await api.post('backoffice/user', {
    ...user,
    condominiumId: user.condominium,
    apartamentId: user.apartment,
  });
  return response.data;
}

