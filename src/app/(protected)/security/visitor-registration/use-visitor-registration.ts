import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchVisitors } from "@/api/fetch-visitors";
import { updateDoneCheckout } from "@/api/update-done-checkout";
import { useUserContext } from "@/providers/use-user-context";
import { getFullMonthInterval } from "@/utils/get-full-month-interval";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface UseVisitorRegistrationProps {
  selectedDate: Date;

}
export function useVisitorRegistration({
  selectedDate
}: UseVisitorRegistrationProps) {
  const { user } = useUserContext();
  const {
    startDate,
    endDate
  } = getFullMonthInterval(format(selectedDate, 'yyyy-MM-dd'))
  const condominiumId = user.condominiumId;
  const queryClient = useQueryClient();

  const { data: visitors, status: visitorsStatus } = useQuery({
    queryKey: ['visitors', startDate, endDate],
    queryFn: () => fetchVisitors({
      condominiumId,
      startDate,
      endDate
    }),
    enabled: !!startDate && !!endDate
  })

  const { mutateAsync: handleDoneCheckout } = useMutation({
    mutationFn: (visitId: number) => updateDoneCheckout({ visitId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['visitors', startDate, endDate]
      })
    }
  })

  const { data: apartaments, status: apartamentsStatus } = useQuery({
    queryKey: ['apartaments'],
    queryFn: async () => fetchApartaments({ condominiumId })
  })

  return {
    visitors,
    visitorsStatus,
    handleDoneCheckout,
    apartaments,
    apartamentsStatus
  }
}