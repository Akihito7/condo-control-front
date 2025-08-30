import { api } from "@/services/api";

interface CreateAssetProps {
  form: FormData;
  condominiumId: number;
}
export async function createAsset({
  condominiumId,
  form
}: CreateAssetProps) {
  const response = await api.post(`structure/asset/${condominiumId}`, form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}