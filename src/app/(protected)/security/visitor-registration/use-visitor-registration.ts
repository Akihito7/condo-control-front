import { fetchVisitors } from "@/api/fetch-visitors";
import { updateDoneCheckout } from "@/api/update-done-checkout";
import { useUserContext } from "@/providers/use-user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface UseVisitorRegistrationProps {
  startDate: Date;
  endDate: Date
}
export function useVisitorRegistration({
  startDate,
  endDate
}: UseVisitorRegistrationProps) {
  const { user } = useUserContext();
  const condominiumId = user.condominiumId;
  const startDateFormmated = format(startDate, 'yyyy-MM-dd');
  const endDateFormmated = format(endDate, 'yyyy-MM-dd');
  const queryClient = useQueryClient();
  const { data: visitors, status: visitorsStatus } = useQuery({
    queryKey: ['visitors', startDate, endDate],
    queryFn: () => fetchVisitors({
      condominiumId,
      startDate: startDateFormmated,
      endDate: endDateFormmated,
    }),
    enabled: !!startDateFormmated && !!endDateFormmated
  })

  const { mutateAsync: handleDoneCheckout } = useMutation({
    mutationFn: (visitId: number) => updateDoneCheckout({ visitId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['visitors', startDate, endDate]
      })
    }
  })

  return {
    visitors,
    visitorsStatus,
    handleDoneCheckout
  }

}