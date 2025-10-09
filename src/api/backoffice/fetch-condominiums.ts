import { api } from "@/services/api";


export interface Condominium {
  id: number;
  tenantId: number;
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  contactEmail: string;
  contactPhone: string;
  manager: string;
  internalRegulations: string;
  foundationDate: string; 
  numberOfBlocks: number;
  numberOfUnits: number;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export async function fetchCondominiums(): Promise<Condominium[]> {
  const response = await api.get('backoffice/condominiums');
  return response.data;
}