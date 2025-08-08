import { deletePoll } from "@/api/delete-poll";
import { fetchAssemblyVirtualPolls } from "@/api/fetch-assembly-polls";
import { useUserContext } from "@/providers/use-user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface UseVirtualAssemblyProps {
  date: Date
}

export function useVirtualAssembly({
  date
}: UseVirtualAssemblyProps) {
  const {
    user
  } = useUserContext();
  const condominiumId = user.condominiumId;
  const dateFormatted = format(date, 'yyyy-MM-dd');

  const { data: polls, status: pollsStatus } = useQuery({
    queryKey: ['polls', dateFormatted],
    queryFn: async () => fetchAssemblyVirtualPolls({ date: dateFormatted, condominiumId }),
    enabled: !!condominiumId
  })

  const queryClient = useQueryClient();
  const { mutateAsync: handleDeletePoll } = useMutation({
    mutationFn: async (pollId: number) => deletePoll(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['polls', dateFormatted]
      })
    }
  })

  return {
    polls,
    pollsStatus,
    handleDeletePoll
  }

}