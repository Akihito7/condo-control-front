import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchApartments } from "@/api/fetch-apartments";
import { fetchDeliveries } from "@/api/fetch-deliveries";
import { fetchDeliveryStatus } from "@/api/fetch-delivery-status";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns"

interface UseOrderingManagementProps {
  startDate: Date;
  endDate: Date;
}

export function useOrderingManagement({
  startDate,
  endDate
}: UseOrderingManagementProps) {

  const { user } = useUserContext();
  const condominiumId = user.condominiumId;

  const startDateFormmated = format(startDate, 'yyyy-MM-dd')
  const endDateFormmated = format(endDate, 'yyyy-MM-dd')

  const { data: deliveries, status: deliveriesStatus } = useQuery({
    queryKey: ['deliveries', startDate, endDate],
    queryFn: async () => fetchDeliveries({ condominiumId, startDate: startDateFormmated, endDate: endDateFormmated })
  })

  const { data: apartaments, status: apartamentsStatus } = useQuery({
    queryKey: ['apartaments'],
    queryFn: async () => fetchApartaments({ condominiumId })
  })

  const { data: statusOptions, status } = useQuery({
    queryKey: ['statusOptions'],
    queryFn: fetchDeliveryStatus
  })
  return {
    deliveries,
    deliveriesStatus,
    apartaments,
    apartamentsStatus,
    statusOptions
  }

}