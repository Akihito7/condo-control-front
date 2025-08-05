import { api } from "@/services/api"

interface FetchApartamentsProps {
  condominiumId: number
}

export interface Apartment {
  apartmentNumber: string;
  blockId: number;
  condominiumId: number;
  createdAt: string;
  id: number;
  status: null | string;
  updatedAt: null | string;
}

export async function fetchApartaments({
  condominiumId
}: FetchApartamentsProps): Promise<Apartment[]> {
  const response = await api.get(`/communication/apartaments/${condominiumId}`);
  return response.data;
}