import { api } from "@/services/api";

interface FetchInterventionsProps {
  date: string
}

export interface Intervention {
  id: number;
  priorityId: number;
  typeId: number;
  description: string;
  supplier: string;
  amount: number;
  paymentMethod: number;
  paymentDate: string; 
  paymentCompletionDate: string | null;
  condominiumAreaId: number;
  statusId: number;
  createdAt: string; 
  updatedAt: string; 
  createdById: number;
  condominiumId: number;
  plannedStart: string; 
  plannedEnd: string; 
  executionTime: string;
  actualStart: string | null;
  actualEnd: string | null;
  maintenanceStatusesId: number;
  maintenanceStatusesName: string;
  isInstallment: boolean,
  numberOfInstallments: number;
  prioritiesId: number;
  prioritiesName: string;
  prioritiesColor: string;
  paymentMethodsId: number;
  paymentMethodsName: string;
  paymentMethodsActive: boolean;
  paymentMethodsCreatedAt: string;
  maintenanceTypesId: number;
  maintenanceTypesName: string;
  condominiumAreasId: number;
  condominiumAreasName: string;
  condominiumAreasType: string;
  condominiumAreasCreatedAt: string; 
  condominiumAreasHourlyRent: number;
  condominiumAreasCondominiumId: number;
}

export async function fetchInterventions({
  date
}: FetchInterventionsProps): Promise<Intervention[]> {
  const response = await api.get(`structure/maintenance-backlog/${date}`);
  return response.data;
}