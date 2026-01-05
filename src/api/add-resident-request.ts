import { api } from "@/services/api";

export async function addResidentRequest(data: FormData) {
  await api.post("communication/resident-request", data);
}
