import { api } from "@/services/api";


interface AssetsMaintenance {
  id: number
  code: string
  name: string
  type: number
  contact: string
  supplier: string
  createdAt: string | null
  condominiumId: number
  installationDate: string
  estimatedUsefulLife: string
  maintenanceFrequency: string
}

export interface DayEvent {
  id: number
  priorityId: number
  typeId: number
  description: string
  supplier: string
  amount: number
  paymentMethod: string | null
  paymentDate: string | null
  paymentCompletionDate: string | null
  condominiumAreaId: number | null
  statusId: number
  createdAt: string
  updatedAt: string
  createdById: number
  condominiumId: number
  plannedStart: string
  plannedEnd: string
  executionTime: string | null
  actualStart: string | null
  actualEnd: string | null
  isInstallment: boolean
  numberOfInstallments: number | null
  assetMaintenanceId: number
  typeMaintenance: string
  contact: string
  assetsMaintenance: AssetsMaintenance
}

interface Day {
  date: string
  dayName: string
  dayEvents: DayEvent[]
}

type MonthDays = Day[]

export async function fetchCalendarMaintenances(date: string): Promise<MonthDays> {
  const response = await api.get(`structure/maintenances/calendar/${date}`)
  return response.data;
}