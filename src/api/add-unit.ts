import { UnitFormData } from "@/app/(protected)/security/units/modal-action-units";
import { api } from "@/services/api";

export async function addUnit(data: UnitFormData) {
  await api.post("security/units", data);
}
