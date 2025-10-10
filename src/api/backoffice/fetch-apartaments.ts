import { api } from "@/services/api";

export type Apartament = {
  apartmentNumber: string;
  blockId: number;
  condominiumId: number;
  createdAt: string;
  email: string | null
  id: number;
  status: string;
  updatedAt: string;
}
export async function fetchApartaments(): Promise<Apartament[]> {
  const response = await api.get('backoffice/apartaments');
  return response.data;
}