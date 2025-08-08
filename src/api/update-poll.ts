import { api } from "@/services/api";

interface UpdatePollProps {
  pollId: number;
  title: string;
  description: string;
  endDate: Date | undefined;
}
export async function updatePoll({
  pollId,
  title,
  description,
  endDate
}: UpdatePollProps) {
  const response = await api.post(`communication/assembly-virtual/polls/update/${pollId}`, {
    title,
    description,
    endDate
  });
  return response.data;
}