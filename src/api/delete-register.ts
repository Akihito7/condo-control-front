import { api } from "@/services/api";

interface DeleteRegisteProps {
  registerId: number
}

export async function deleteRegister({ registerId }: DeleteRegisteProps) {
  const response = await api.delete(
    `/finance/registers/${registerId}`
  );
  return response.data;
}