import { api } from "@/services/api";

export async function deleteEventCondominium(eventId: number) {
 await api.delete(`communication/schedule/${eventId}`)
}