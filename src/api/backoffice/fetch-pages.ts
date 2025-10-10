import { api } from "@/services/api";

export interface Page {
  iconName: string;
  id: number
  moduleId: number;
  name: string;
  routePath: string;
  updatedAt: string | null
  createdAt: string | null
}

export async function fetchPages() {
  const response = await api.get("backoffice/pages");
  return response.data;
}