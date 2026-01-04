import { api } from "@/services/api";

export async function deleteEmployeeUnitWorks(employeeId: number) {
  await api.delete(`structure/unit-works/form/${employeeId}`);
}
