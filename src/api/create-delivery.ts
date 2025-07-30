import { api } from "@/services/api"

interface CreateDeliveryProps {
  formData: FormData
}

export async function createDelivery({ formData }: CreateDeliveryProps) {
  await api.post('/communication/delivery/create', formData);
}