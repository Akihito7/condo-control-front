import { api } from "@/services/api";

interface FetchAttachementProps {
  relatedType: string;
  relatedId: number;
}

export interface File {
  id: number;
  relatedType: string;
  relatedId: number;
  condominiumId: number;
  date: string;
  path: string;
  bucketName: string;
  originalName: string;
  screenOrigin: string;
  createdAt: string;
  updatedAt: string;
  supabaseId: string;
}

export async function fetchAttachment({
  relatedId,
  relatedType,
}: FetchAttachementProps): Promise<File[]> {
  const response = await api.get(
    `structure/attachments/${relatedType}/${relatedId}`
  );
  return response.data;
}
