import { api } from "@/services/api";

export interface AreaData {
  areaId: number;
  areaName: string;
  count: number;
}

export async function fetchChartImprovementsByArea(date: string): Promise<AreaData[]> {
  const response = await api.get(`structure/maintenace-backlog/chart/improvements-by-area/${date}`);
  return response.data;
}