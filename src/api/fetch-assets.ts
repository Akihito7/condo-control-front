import { api } from "@/services/api";

interface FetchAssetsProps {
  condominiumId: number
}


export interface Asset {
  id: number
  name: string
  codeItem: string
  areaId: number
  categoryId: number
  assetCategoriesId: number
  assetCategoriesName: string
  assetStatusId: number
  assetStatusName: string
  assetStatusColor: string
  statusId: number
  condominiumId: number
  photoUrl: string
  publicUrl: string
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
  condominiumAreasId: number;
  condominiumAreasName: string
  condominiumAreasType: string;
}


export async function fetchAssets({
  condominiumId
}: FetchAssetsProps): Promise<Asset[]> {
  const response = await api.get(`structure/assets/${condominiumId}`);
  const data = response.data;
  return data;
}