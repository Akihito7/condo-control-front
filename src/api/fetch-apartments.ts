import { api } from "@/services/api";


export interface ApartmentWithBlock {
  id: number;
  blockId: number;
  apartmentNumber: string;
  status: string | null;
  createdAt: string;
  updatedAt: string | null;
  block: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string | null;
    description: string | null;
    condominium_id: number;
  };
};


interface FetchApartmentsProps {
  condominiumId: number
}
export async function fetchApartments({ condominiumId }: FetchApartmentsProps): Promise<ApartmentWithBlock[]> {

  const response = await api.get(
    `/finance/apartments/${condominiumId}`
  );

  return response.data;
}