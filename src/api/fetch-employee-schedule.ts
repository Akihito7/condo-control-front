import { api } from "@/services/api";

interface FetchEmployeeScheduleProps {
  condominiumId: number;
  date: string;
}
export async function fetchEmployeeSchedule({
  condominiumId,
  date
}: FetchEmployeeScheduleProps) {
  const response = await api.get(`structure/employee/schedule/${condominiumId}/${date}`);
  return response.data
}