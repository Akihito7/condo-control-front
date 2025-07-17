import { api } from "@/services/api"

interface DownloadAttchmentProps {
  fullPath: string
}
export async function downloadAttchment({ fullPath }: DownloadAttchmentProps) {

  const response = await api.post('/communication/opening-calls/attachment/donwload', {
    fullPath,
  });

  return response.data
}