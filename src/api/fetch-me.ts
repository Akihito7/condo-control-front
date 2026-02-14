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
  condominiumLogo: string | null;
  pagesWithPermissionByRole: RolePageRelation[];
  modulesWithPermissionByRole: ModulePermissionByRole[];
  tabStructure: Module[];
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

export type ModulePermissionByRole = {
  moduleId: number;
  read: boolean;
  roleName: string;
};

interface Page {
  pageId: number;
  roleName: string;
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
  pageName: string;
  pageModuleId: number;
  pageCreatedAt: string;
  pageRoutePath: string;
  pageUpdatedAt: string | null;
  pageIconName: string;
}

export interface Module {
  moduleId: number;
  moduleName: string;
  moduleRoutePath: string;
  modulePages: Page[];
}

export async function fetchMe(): Promise<User> {
  const response = await api.get("auth/me");
  return response.data;
}
