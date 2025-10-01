import { api } from "@/services/api";

interface SpaceAreaBooking {
  areaName: string, total: number;
}
export async function fetchSpacesAreasBookingsChart(date: string): Promise<SpaceAreaBooking[]> {
  const response = await api.get(`structure/management-spaces/indicators/areas-bookings/${date}`)
  return response.data;
}