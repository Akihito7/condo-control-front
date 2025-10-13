import { api } from "@/services/api";

export interface Module {
  description: string;
  id: number;
  isSuper: boolean;
  name: string
  routePath: string;
  createdAt: string | null
  updatedAt: string | null

}
export async function fetchModules(): Promise<Module[]> {
  const response = await api.get('backoffice/modules')
  return response.data;
}
