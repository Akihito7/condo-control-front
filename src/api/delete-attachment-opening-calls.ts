import { api } from "@/services/api";

interface DeleteAttachmentOpeningCallsProps {
  attachmentId: number;
}

export async function deleteAttachmentOpeningCalls({
  attachmentId
}: DeleteAttachmentOpeningCallsProps) {
  const response = await api.delete(`communication/opening-calls/attachment/delete/${attachmentId}`);
  return attachmentId
} 