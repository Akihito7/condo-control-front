import { api } from "@/services/api";

export interface Employee {
  userId: number;
  userName: string
}
export async function fetchEmployees(): Promise<Employee[]> {
  const response = await api.get("communication/employees")
  return response.data
}