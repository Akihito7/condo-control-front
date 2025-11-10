import { api } from "@/services/api";

export interface Attachment {
  id: number;
  bucketName: string;
  condominiumId: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  originalName: string;
  path: string;
  relatedId: number;
  relatedType: string;
  screenOrigin: string;
  supabaseId: string;
}

export async function addAttachmentMaintenanceAsset(form: FormData): Promise<Attachment[]> {
  const response = await api.post('structure/maintenance-management/assets/attchaments', form)
  return response.data;
}