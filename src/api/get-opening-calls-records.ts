import { api } from "@/services/api";

interface GetOpeningCallsRecords {
  condominiumId: number;
  startDate: string;
  endDate: string;
}


export type OpeningCall = {
  id: number;
  date: string;
  issueTypeId: number;
  description: string;
  responsibleUserId: number;
  startedAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  statusId: number;
  condominiumId: number;
  userId: number;
  userName: string;
  callStatusesId: number;
  callStatusesName: string;
  issueTypesId: number;
  issueTypesName: string;
  attachments: Attachment[]
  responsibleName : string
};


interface Attachment {
  id: number;
  relatedType: string;         // Ex: 'calls'
  relatedId: number;           // ID do registro relacionado
  condominiumId: number;       // ID do condomínio
  date: string;                // Ex: '2025-07-16' (pode usar Date se converter)
  path: string;                // Caminho completo no bucket
  bucketName: string;          // Ex: 'condo'
  originalName: string;        // Nome original do arquivo
  screenOrigin: string;        // Ex: 'calls' (origem lógica da tela)
  createdAt: string;           // ISO datetime
  updatedAt: string;           // ISO datetime
  supabaseId: string | null;   // ID interno do Supabase (se for usado)
  responsibleName : string;
}


export async function getOpeningCallsRecords({
  condominiumId,
  startDate,
  endDate
}: GetOpeningCallsRecords): Promise<OpeningCall[]> {
  const response = await api.get(`communication/opening-calls/records/${condominiumId}/${startDate}/${endDate}`);
  return response.data;
}