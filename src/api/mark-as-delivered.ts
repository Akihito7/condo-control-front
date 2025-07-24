import { api } from "@/services/api"

interface MarkAsDeliveredProps {
  deliveryId: number
}

export async function markAsDelivered({
  deliveryId
}: MarkAsDeliveredProps) {
  await api.patch(`/communication/delivery/mark-as-delivered/${deliveryId}`)
}