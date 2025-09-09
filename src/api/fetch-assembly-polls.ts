import { api } from "@/services/api";

interface FetchAssemblyVirtualPollsProps {
  date: string;
  condominiumId: number
}


export interface Response {
  accuracyPercentageParticipation: number;
  data: PollWithStats[]
}
export type PollWithStats = {
  id: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string | null;
  condominiumId: number;
  title: string;
  finalResult: string | null;
  status: 'Aberto' | 'Fechado' | string;
  totalVotes: number;
  totalVotesYes: number;
  totalVotesNo: number;
  percentageYes: number;
  percentageNo: number;
  currentUserAlreadyVoted: boolean
  currentVoteUser: number | null
  percentageParticipation: number;
  description: string;
  votesInfo: {
    optionId: number;
    optionName: string;
    total: number;
  }[]
};

export async function fetchAssemblyVirtualPolls({
  date,
  condominiumId
}: FetchAssemblyVirtualPollsProps): Promise<Response> {
  const response = await api.get(`communication/assembly-virtual/polls/${condominiumId}/${date}`);
  const data = response.data;
  return data;
}