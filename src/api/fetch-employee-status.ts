import { api } from "@/services/api";

interface Option {
  id: number;
  name: string
}


export async function fetchEmployeeStatus(): Promise<Option[]> {
  const response = await api.get('structure/employee-status/options');
  return response.data
}