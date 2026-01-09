import { api } from "@/services/api";

interface FetchUnitWorksProps {
  startDate: string;
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
}: FetchUnitWorksProps): Promise<WorkUnit[]> {
  const response = await api.get(
    `structure/unit-works/${startDate}`
  );
  return response.data;
}
