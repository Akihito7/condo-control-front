import { api } from "@/services/api";

interface FetchAttachementProps {
  relatedType: string;
  relatedId: number;
}

export async function fetchAttachment({
  relatedId,
  relatedType,
}: FetchAttachementProps) {
  const response = await api.get(
    `structure/attachments/${relatedType}/${relatedId}`
  );
  return response.data;
}
