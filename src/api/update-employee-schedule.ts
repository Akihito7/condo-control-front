import { api } from "@/services/api";

export async function updateEmployeeSchedule(data: any, condominiumId: number) {
  const response = await api.put(`structure/employee/schedule/update/${condominiumId}`, 
  data.schedule
  )
}