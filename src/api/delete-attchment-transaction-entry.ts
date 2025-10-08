import { api } from "@/services/api";

export async function deleteAttchmentTransacationEntry(fileId: number): Promise<number> {
  await api.delete(`finance/register/delete/file/${fileId}`)
  return fileId;
}