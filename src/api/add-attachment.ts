import { api } from "@/services/api"

interface AddAttachmentsOpeningCallsProps {
  formData: FormData
}

export async function addAttachmentsOpeningCalls({ formData }: AddAttachmentsOpeningCallsProps) {
  const response = await api.post('communication/opening-calls/attachment/upload', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data

}