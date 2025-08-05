import { api } from "@/services/api";

export async function deleteEmployeeStructure(employeeId: number) {
  await api.delete("structure/employee/delete", {
    data: {
      employeeId
    }
  })
}