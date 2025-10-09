import { fetchCondominiums } from "@/api/backoffice/fetch-condominiums";
import { fetchUsers } from "@/api/backoffice/fetch-users";
import { useQuery } from "@tanstack/react-query";

export function useManagementSystem() {

  const { data: users, status: statusUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  const { data: condominiums, status: statusCondominiums } = useQuery({
    queryKey: ['condominiums'],
    queryFn: fetchCondominiums
  })

  return {
    users,
    statusUsers,
    condominiums,
    statusCondominiums
  }

}