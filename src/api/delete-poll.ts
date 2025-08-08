import { api } from "@/services/api";

export async function deletePoll(pollId: number) {
  await api.delete(`communication/assembly-virtual/polls/delete/${pollId}`)
}