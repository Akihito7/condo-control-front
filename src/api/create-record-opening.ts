import { api } from "@/services/api";


interface CreateRecordOpeningProps {
  condominiumId: number,
  formData: FormData
}
export async function createRecordOpening({
  condominiumId,
  formData
}: CreateRecordOpeningProps) {  

  const response = await api.post(
    `communication/opening-calls/records/create/${condominiumId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data
}
