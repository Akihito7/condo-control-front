import { api } from "@/services/api";

export type Apartament = {
  apartmentNumber: string;
  blockId: number;
  condominiumId: number;
  createdAt: string;
  email: string | null;
  id: number;
  status: string;
  updatedAt: string;
};

interface FetchApartamentsProps {
  condominiumId: number;
}
export async function fetchApartaments({
  condominiumId,
}: FetchApartamentsProps): Promise<Apartament[]> {
  const response = await api.get(`backoffice/apartaments/${condominiumId}`);
  return response.data;
}
