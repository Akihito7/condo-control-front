import { api } from "@/services/api";

export async function fetchResidentCallGravities() {
  const response = await api.get(
    "communication/resident-request/options/gravity"
  );
  return response.data;
}
