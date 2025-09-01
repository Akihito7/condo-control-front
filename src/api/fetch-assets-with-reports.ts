import { api } from "@/services/api";


interface Photo {
  id: number;
  url: string;
  publicUrl: string
  [key: string]: any; // caso haja outros campos dinâmicos
}

interface AssetReport {
  id: number;
  assetId: number;
  description: string;
  createdAt: string;
  reportedBy: number;
  photos: Photo[];
}

interface Asset {
  id: number;
  areaId: number;
  categoryId: number;
  codeItem: string;
  condominiumId: number;
  name: string;
  photoUrl: string | null;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  assetReports: AssetReport[];
}

export async function fetchAssetsWithReports(assetId: string): Promise<Asset[]> {
  const response = await api.get(`structure/assets/details/${assetId}`);
  const data = response.data;
  console.log(data);
  return data
}