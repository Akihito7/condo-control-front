import { api } from "@/services/api";

export interface CategoryType {
  id: number
  incomeExpenseTypeId: number
  name: string
  recordTypeId: number;
}
export async function fetchCategoriesOptions(): Promise<CategoryType[]> {
  const response = await api.get(
    `/finance/categories-options`
  );
  return response.data;
}