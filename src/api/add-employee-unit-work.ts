import { api } from "@/services/api";

interface AddEmployeeUnitWorkProps {
  workId: number;
  fullName: string;
  cpf: string;
}
export async function addEmployeeUnitWork({
  workId,
  fullName,
  cpf,
}: AddEmployeeUnitWorkProps) {
  await api.post(`structure/unit-works/form/${workId}/employees`, {
    fullName,
    cpf,
  });
}
