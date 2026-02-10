import { api } from "@/services/api";

interface UpdateUnitProps {
  unitId: number;
  data: any;
}
export async function updateUnit({ unitId, data }: UpdateUnitProps) {
  await api.put(`security/units/${unitId}`, data);
}
