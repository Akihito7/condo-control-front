import { api } from "@/services/api";

interface FetchVisitorsProps {
  condominiumId: number;
  startDate: string;
  endDate: string;
}


interface PersonVisit {
  id: number;
  cpf: string;
  vehicle: string;
  visitId: number;
  fullName: string;
}

interface Visit {
  id: number;
  condominiumId: number;
  apartamentId: number;
  checkIn: string;
  checkOut: string | null;
  visitType: string;
  blockId: number | null;
  personVisit: PersonVisit[]; 
  apartmentApartmentNumber: string;
}

export async function fetchVisitors({
  condominiumId,
  startDate,
  endDate
}: FetchVisitorsProps): Promise<Visit[]> {
  const response = await api.get(`security/visitors/${condominiumId}/${startDate}/${endDate}`);
  return response.data
}