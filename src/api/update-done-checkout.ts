import { api } from "@/services/api";

interface UpdateDoneCheckoutProps {
  visitId: number;
}

export async function updateDoneCheckout({
  visitId
}: UpdateDoneCheckoutProps) {
  await api.patch(`security/visitors/check-out/${visitId}`);
}