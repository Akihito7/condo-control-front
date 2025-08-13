import { api } from "@/services/api";

interface FetchInterventionCardsProps {
  date: string
}
type FinancialSummary = {
  newMonthlyFixedCosts: number;
  approvedImprovementsCost: number;
  balance: number;
};

export async function fetchInterventionCards({
  date
}: FetchInterventionCardsProps): Promise<FinancialSummary> {
  const response = await api.get(`structure/maintenance-backlog/cards/${date}`)
  return response.data;
}