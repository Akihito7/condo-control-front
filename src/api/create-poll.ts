import { api } from "@/services/api";

interface CreatePollProps {
  title: string;
  description: string;
  endDate: Date | undefined;
  options: {
    name: string
  }[]
}
export async function createPoll({
  title,
  description,
  endDate,
  options
}: CreatePollProps) {
  const response = await api.post('communication/assembly-virtual/polls/create', {
    title,
    description,
    endDate,
    options
  });
  return response.data;
}