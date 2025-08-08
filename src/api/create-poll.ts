import { api } from "@/services/api";

interface CreatePollProps {
  title: string;
  description: string;
  endDate: Date | undefined;
}
export async function createPoll({
  title,
  description,
  endDate
}: CreatePollProps) {
  const response = await api.post('communication/assembly-virtual/polls/create', {
    title,
    description,
    endDate
  });
  return response.data;
}