import { api } from "@/services/api";

interface GetCardsOpeningCalls {
  condominiumId: number;
  startDate: string;
  endDate: string;
}

interface Cards {
  totalCallIsGoing: number,
  totalCallsSolved: number,
  accuracyHoursCallSolved: number,
  totalCallsMonth: number
}

export async function getCardsOpeningCalls({
  condominiumId,
  startDate,
  endDate
}: GetCardsOpeningCalls): Promise<Cards> {
  const response = await api.get(`communication/opening-calls/cards/${condominiumId}/${startDate}/${endDate}`);
  return response.data;
}