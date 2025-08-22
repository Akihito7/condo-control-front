import { api } from "@/services/api";

interface UpdatePollProps {
  pollId: number;
  title: string;
  description: string;
  endDate: Date | undefined;
  options: {
    id?: number,
    name: string
  }[],
  optionsToRemove: number[];
}
export async function updatePoll({
  pollId,
  title,
  description,
  endDate,
  options,
  optionsToRemove
}: UpdatePollProps) {
  const response = await api.put(`communication/assembly-virtual/polls/update/${pollId}`, {
    title,
    description,
    endDate,
    options,
    optionsToRemove
  });
  return response.data;
}