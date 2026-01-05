import { api } from "@/services/api";

export async function fetchResidentCallStatus() {
  const response = await api.get(
    "communication/resident-request/options/status"
  );
  return response.data;
}
