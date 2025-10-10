import { api } from "@/services/api";



export interface Tenant {
  createdAt: string | null;
  id: number;
  isActive: boolean;
  lastPaymentAt: string | null
  name: string;
  ownerId: number;
  planId: number;
  updatedAt: string | null
}

export async function fetchTenants(): Promise<Tenant[]> {
  const response = await api.get('backoffice/tenants')
  return response.data;
}