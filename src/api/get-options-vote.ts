import { api } from "@/services/api";

export async function getOptionsVote(pollId: number) {
  const response = await api.get(`communication/assembly-virtual/polls/vote-options/${pollId}`)
  const data = response.data;
  return data;
}