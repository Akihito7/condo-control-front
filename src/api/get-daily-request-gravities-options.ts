import { api } from "@/services/api";
import { Option } from "./fetch-work-areas";



export async function getDailyRequestGravitiesOptions() : Promise<Option[]>{
  const response = await api.get("structure/daily-request/options/gravity");
  return response.data;
}
