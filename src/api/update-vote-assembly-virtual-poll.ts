import { api } from "@/services/api";

export interface UpdateVoteAssemblyVirtualPollProps {
  voteId: number;
  choice: string;
}
export async function updateVoteAssemblyVirtualPoll({
  voteId,
  choice
}: UpdateVoteAssemblyVirtualPollProps) {
  const response = await api.patch(`/communication/assembly-virtual/polls/vote/${voteId}`, {
    choice
  })
  return response.data;
} 