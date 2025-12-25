import { FormDataDailyRequest } from "@/app/(protected)/structure/daily-requests/modal-action";
import { api } from "@/services/api";

export async function addDailyRequest(form: FormDataDailyRequest) {
  const { data } = await api.post("/structure/daily-request", form);

  return data;
}
