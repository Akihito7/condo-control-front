import { api } from "@/services/api";

export interface OptionEmployee {
  id: number;
  name: string
  has_login: boolean
}

export async function fetchEmployeeRoles(): Promise<OptionEmployee[]> {
  const response = await api.get('structure/employee-roles/options');
  return response.data
}