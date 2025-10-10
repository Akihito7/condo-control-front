import { UpdateUserFormValues } from "@/app/(protected)/backoffice/users/edit/[userId]/form-edit";
import { api } from "@/services/api";

export async function updateUser(user: UpdateUserFormValues) {
  const response = await api.put(`backoffice/user/${user.id}`, {
    ...user,
    condominiumId: user.condominium,
    apartamentId: user.apartment,
  });
  return response.data;
}

