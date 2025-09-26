import { api } from "@/services/api";


interface FetchProjectionProps {
  condominiumId: number;
  date: Date;
}


interface ProjectionRegistersResponse {
  id: number;
  name: string;
  total: number;
  type: string;
  observation: string;
}
export async function fetchProjectionRegisters({ condominiumId, date }: FetchProjectionProps): Promise<ProjectionRegistersResponse[]> {
  const response = await api.get(`/finance/projection/registers/${condominiumId}/${date}`);
  const data = response.data;
  return data
}