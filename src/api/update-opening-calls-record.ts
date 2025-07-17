import { api } from "@/services/api";

interface UpdateOpeningCallsRecord {
  recordId: number;
  data: any;
}
export async function updateOpeningCallsRecord({
  recordId,
  data
}: UpdateOpeningCallsRecord) {
  const response = await api.put(`/communication/opening-calls/records/update/${recordId}`, data);
  return response.data
}