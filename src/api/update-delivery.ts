import { api } from "@/services/api"

interface UpdateDeliveryProps {
  deliveryId: number
  formData: FormData
}

export async function updateDelivery({ formData, deliveryId }: UpdateDeliveryProps) {
  await api.patch(`/communication/delivery/update/${deliveryId}`, formData)
}