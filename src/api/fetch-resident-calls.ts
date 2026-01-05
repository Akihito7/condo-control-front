import { api } from "@/services/api";

interface FetchResidentCallsProps {
  startDate: string;
  endDate: string;
}
export async function fetchResidentCalls({
  startDate,
  endDate,
}: FetchResidentCallsProps) {
  const response = await api.get(
    `communication/resident-request/${startDate}/${endDate}`
  );

  return response.data;
}
