import { api } from "@/services/api"

interface CreateDeliveryProps {
  formData: FormData
}

export async function createDelivery({ formData }: CreateDeliveryProps) {
  const response = await api.post('/communication/delivery/create', formData);
  console.log("response", response.data)
}