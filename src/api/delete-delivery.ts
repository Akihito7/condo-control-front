import { api } from "@/services/api";

interface DeleteDeliveryProps {
  deliveryId: number
}

export async function deleteDelivery({
  deliveryId
}: DeleteDeliveryProps) {
  await api.delete(`communication/delivery/delete/${deliveryId}`)
}