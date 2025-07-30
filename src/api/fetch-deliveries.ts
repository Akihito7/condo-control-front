import { api } from "@/services/api";

interface FetchDeliveriesProps {
  condominiumId: number;
  startDate: string;
  endDate: string
}


export interface Delivery {
  id: number;
  apartmentId: number;
  condominiumId: number;
  description: string;
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string | null;
  pickedUpAt: string;
  receivedAt: string;
  apartmentApartmentNumber: string
  attachments: Attachment[] | undefined
  status: number;
}

interface Attachment {
  bucketName: string;
  condominiumId: number;
  createdAt: string; // ou Date
  date: string; // ou Date
  id: number;
  originalName: string;
  path: string;
  relatedId: number;
  relatedType: "package" | string; // use union type para outros valores possíveis
  screenOrigin: "package" | string; // use union type para outros valores possíveis
  supabaseId: string;
  updatedAt: string; // ou Date
}


export async function fetchDeliveries({
  condominiumId,
  startDate,
  endDate
}: FetchDeliveriesProps): Promise<Delivery[]> {
  const response = await api.get(`/communication/deliveries/${condominiumId}/${startDate}/${endDate}`)
  return response.data;
}