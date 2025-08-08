import { api } from "@/services/api";

interface CreateVoteAssemblyVirtualPollProps {
  pollId: number;
  choice: string;

}
export async function createVoteAssemblyVirtualPoll({
  pollId,
  choice
}: CreateVoteAssemblyVirtualPollProps) {
  const response = await api.post(`/communication/assembly-virtual/polls/vote/${pollId}`, {
    choice
  });
}