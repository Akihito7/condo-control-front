import { api } from "@/services/api";


interface UpdateEmployeeStructureProps {
  employeeId: number;
  name: string;
  salary: string;
  cpf: string;
  employeeRoleId: string;
  phoneNumber: string;
  workAreaId: string;
  status: string;
  condominiumId: number
}
export async function updateEmployeeStructure(data: UpdateEmployeeStructureProps) {
  const response = await api.patch('structure/employee/update', data);
}