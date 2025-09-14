import { api } from "@/services/api";


export type IndicatorsResume = {
  accuracyExecutionDaysImprovements: number;
  accuracyImprovementCost: number;
  accuracyMaintenanceCost: number;
  improvementsCost: number;
  improvementsImplemented: number;
  maintenancePerfomed: number;
  maintenanceCost: number;
  percentageImpactImprovements: string;
  percentageImpactMaintenances: string;
};

export async function fetchResumeIndicatorsMaintenances(date: string): Promise<IndicatorsResume> {
  const response = await api.get(`structure/maintenance-backlog/indicators/resume/${date}`);
  return response.data;
}