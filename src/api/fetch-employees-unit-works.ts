import { api } from "@/services/api";

export async function fetchEmployesUnitWorks(workId: number) {
  const response = await api.get(`structure/unit-works/form/${workId}/emplooyes`);
  return response.data;
}
