import { api } from "@/services/api";


interface FetchResumeDelinquencyProps {
  startDate: string;
  endDate: string;
}

export type Summary = {
  uniqueApartmentIds: Set<number>;
  totalInstallments: number;
  unpaidCount: number;
  averageDaysOverdue: number;
  totalAmountToReceive: number;
  totalDaysOverdue: number;
  uniqueApartamentsLength: number;
  delinquencyPercentage: string;
};

// Exemplo


export async function fetchResumeDelinquency({
  startDate,
  endDate
}: FetchResumeDelinquencyProps): Promise<Summary> {
  const response = await api.get(`finance/delinquency/resume/${startDate}/${endDate}`);
  return response.data;
}