import { api } from "@/services/api";

interface GetManagementOfCommomSpacesProps {
  condominiumId: number;
}

export interface CondominiumArea {
  id: number
  name: string
  type: string
  hourly_rent: number
  condominium_id: number
  created_at: Date
}

export async function getManagementOfCommomSpaces({
  condominiumId
}: GetManagementOfCommomSpacesProps): Promise<CondominiumArea[]> {
  const response = await api.get(`structure/management-spaces/${condominiumId}`);
  return response.data
}