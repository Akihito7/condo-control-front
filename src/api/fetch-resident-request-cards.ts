import { api } from "@/services/api";

interface FetchResidentRequestCardsProps {
  startDate: string;
  endDate: string;
}

interface CardsCount {
  onGoing: number;
  solved: number;
  total: number;
  averageTime: number;
}
export async function fetchResidentRequestCards({
  startDate,
  endDate,
}: FetchResidentRequestCardsProps): Promise<CardsCount> {
  const response = await api.get(
    `communication/resident-request/cards/${startDate}/${endDate}`,
  );
  return response.data;
}
