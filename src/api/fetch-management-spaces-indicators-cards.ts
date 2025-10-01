import { api } from "@/services/api";

interface Response {
  totalBookingsMonth: number,
  totalOccupationMonth: string,
  totalRevenueMOnth: number
}

export async function fetchManagementSpacesIndicatorsCards(date: string): Promise<Response> {
  const response = await api.get(`structure/management-spaces/indicators/cards/${date}`);
  return response.data;
}