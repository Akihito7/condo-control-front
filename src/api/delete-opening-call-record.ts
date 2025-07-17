import { api } from "@/services/api"

interface DeleteOpeningCallRecordProps {
  openingCallRecordId: number
}

export async function deleteOpeningCallRecord({
  openingCallRecordId
}: DeleteOpeningCallRecordProps) {
  const response = await api.delete(`/communication/opening-calls/records/delete/${openingCallRecordId}`)
  return response.data;
}