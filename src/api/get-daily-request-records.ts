import { api } from "@/services/api";

interface GetDailyRequestRegisters {
  date: string;
}
export async function getDailyRequestRegisters({
  date,
}: GetDailyRequestRegisters) {
  const response = await api.get(`structure/daily-request/${date}`);
  return response.data;
}
