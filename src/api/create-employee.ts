import { api } from "@/services/api";

export interface CreateEmployeeProps {
  name: string;
  salary: string;
  cpf: string;
  employeeRoleId: string;
  phoneNumber: string;
  workAreaId: string;
  status: string;
  condominiumId: number
}

export async function createEmployee(data: CreateEmployeeProps) {
  const response = await api.post('structure/employee/create', data);
  return response.data
}