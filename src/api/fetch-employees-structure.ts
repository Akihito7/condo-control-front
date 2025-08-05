import { api } from "@/services/api";

export interface FetchEmployeesStructureProps {
  condominiumId: number
}
export type Employee = {
  id: number;
  name: string;
  salary: number;
  cpf: string;
  phoneNumber: string;
  statusId: number;
  userId: number;
  employeeRoleId: number;
  workAreaId: number;
  condominiumId: number;
  email: string
};

export async function fetchEmployeesStructure({
  condominiumId
}: FetchEmployeesStructureProps): Promise<Employee[]> {
  const response = await api.get(`structure/employee/list/${condominiumId}`)
  return response.data
}