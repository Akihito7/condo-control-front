import { api } from "@/services/api";


export interface CreateVisitProps {
  condominiumId: number;
  apartamentNumber?: string | null;
  vehiclePlate?: string | null;
  visitType: string;
  people: {
    fullName: string;
    cpf: string;
  }[]
}

export async function CreateVisit(data: CreateVisitProps) {
  await api.post('security/visitor/registration', data);
}