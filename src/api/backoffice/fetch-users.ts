import { api } from "@/services/api";


export type UserAssociation = {
  userAssociationApartmentId: number | null;
  userAssociationCondominiumId: number;
  userAssociationCreatedAt: string;
  userAssociationId: number;
  userAssociationRole: string;
  userAssociationUpdatedAt: string | null;
  userAssociationUserId: number;
};

export type User = {
  cpf: string;
  createdAt: string;
  email: string;
  id: number;
  isSuper: null | boolean;
  name: string;
  password: string;
  phone: string;
  updatedAt: string | null;
  userAssociationApartmentId?: number | null;
  userAssociationCondominiumId?: number;
  userAssociationCreatedAt?: string;
  userAssociationId?: number;
  userAssociationRole?: string;
  userAssociationUpdatedAt?: string | null;
  userAssociationUserId?: number;
};

export async function fetchUsers(): Promise<User[]> {
  const response = await api.get('backoffice/users');
  return response.data;
}