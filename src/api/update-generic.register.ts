import { api } from "@/services/api";

interface UpdateGenericRegister<T> {
  tableName: string;
  registerId: number;
  data: T;
}
export async function updateGenericRegister<T>({
  registerId,
  tableName,
  data,
}: UpdateGenericRegister<T>) {
  await api.put(`structure/generic/${tableName}/${registerId}`, data);
}
