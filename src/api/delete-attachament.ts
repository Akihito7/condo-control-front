import { api } from "@/services/api";

export async function deleteAttachement(attachmentId: number) {
  await api.delete(`structure/attachments/${attachmentId}`);
}
