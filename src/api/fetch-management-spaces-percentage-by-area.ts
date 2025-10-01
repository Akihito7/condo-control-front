import { api } from "@/services/api";


export type AreaEventIndicatorsPercentage = {
  areaName: string;
  total: number;
  totalGeral: number;
  percentual: number;
};

export async function fetchManagementSpacesPercentageByArea(date: string): Promise<AreaEventIndicatorsPercentage[]> {
  const response = await api.get(`structure/management-spaces/indicators/percentage-by-area/${date}`);
  return response.data;
}