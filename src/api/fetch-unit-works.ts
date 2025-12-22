import { api } from "@/services/api";

interface FetchUnitWorksProps {
  startDate: string;
  endDate: string;
}

export interface WorkUnit {
  id: number;
  condominiumId: number;
  blockId: number;
  apartamentId: number;
  statusId: number;
  forecastDate: string;
  description: string;
  hasArtRrt: boolean;
  observations: string;
  createdAt: string;
}

export async function fetchUnitWorks({
  startDate,
  endDate,
}: FetchUnitWorksProps): Promise<WorkUnit[]> {
  const response = await api.get(
    `structure/unit-works/${startDate}/${endDate}`
  );
  return response.data;
}
