import { api } from "@/services/api";

export type User = {
  id: number;
  name: string;
  isSuper: boolean;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string | null;
  cpf: string;
  userAssociationId: number;
  userAssociationRole: string;
  userAssociationUserId: number;
  userAssociationCreatedAt: string;
  userAssociationUpdatedAt: string | null;
  userAssociationApartmentId: number | null;
  userAssociationCondominiumId: number;
  condominiumId: number;
  pagesWithPermissionByRole: RolePageRelation[]
};

export type RolePageRelation = {
  pageId: number;
  roleName: string;
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
  pageName: string;
  pageModuleId: number | null;
  pageCreatedAt: string;  
  pageRoutePath: string;
  pageUpdatedAt: string | null; 
};

export async function fetchMe(): Promise<User> {
  const response = await api.get("auth/me");
  console.log("me", response.data)
  return response.data
}