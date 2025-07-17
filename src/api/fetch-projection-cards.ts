import { api } from "@/services/api";


interface GetProjectionProps {
  condominiumId: number;
  date: Date;
}

interface ProjectionCardsResponse {
  incomesTotal: number
  expensesTotal: number
  balance: number
  balanceAccumulated: number
}
export async function fetchProjectionCards({ condominiumId, date }: GetProjectionProps): Promise<ProjectionCardsResponse> {
  const response = await api.get(`/finance/projection/cards/${condominiumId}/${date}`);
  const data = response.data;
  return data
}