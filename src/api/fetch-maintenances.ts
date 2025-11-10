import { api } from "@/services/api";


type Maintenance = {
  id: number;
  assetMaintenanceId: number | null;
  assetsMaintenanceCode: string;
  assetsMaintenanceCondominiumId: number;
  assetsMaintenanceContact: string;
  assetsMaintenanceCreatedAt: string | null;
  assetsMaintenanceEstimatedUsefulLife: string;
  assetsMaintenanceId: number;
  assetsMaintenanceInstallationDate: string;
  assetsMaintenanceMaintenanceFrequency: string;
  assetsMaintenanceName: string;
  assetsMaintenanceSupplier: string;
  assetsMaintenanceType: number;
  condominiumAreaId: number | null;
  condominiumId: number;
  contact: string;
  createdAt: string;
  createdById: number;
  description: string;
  executionTime: string | null;
  isInstallment: boolean;
  numberOfInstallments: number | null;
  paymentCompletionDate: string | null;
  paymentDate: string | null;
  paymentMethod: string | null;
  plannedEnd: string | null;
  plannedStart: Date | null;
  priorityId: number;
  statusId: number;
  supplier: string;
  typeId: number;
  typeMaintenance: string;
  updatedAt: string;
  actualStart: string | null;
  actualEnd: string | null;
  amount: number;
};

export async function fetchMaintenaces(date: string): Promise<Maintenance[]> {
  const response = await api.get(`structure/maintenances/${date}`);
  return response.data
}