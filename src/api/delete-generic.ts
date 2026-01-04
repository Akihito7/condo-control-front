import { api } from "@/services/api";

interface DeleteGenericProps {
  tableName: string;
  registerId: number | string;
  isSoftDelete?: boolean;
}
export async function deleteGeneric({
  registerId,
  tableName,
  isSoftDelete,
}: DeleteGenericProps) {
  await api.delete(`structure/generic/${tableName}/${registerId}`, {
    params: { isSoftDelete },
  });
}
