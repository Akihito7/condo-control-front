import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchAreaAvailability } from "@/api/fetch-area-availability";
import { fetchEventsByCondominiumArea } from "@/api/fetch-events-by-condominium-area";
import { getManagementOfCommomSpaces } from "@/api/get-management-commom-spaces";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface UseManagementOfCommomSpacesProps {
  date: Date;
  condominiumAreaIdSelected: string;
}
export function useManagementOfCommomSpaces({
  date,
  condominiumAreaIdSelected,
}: UseManagementOfCommomSpacesProps) {
  const { user } = useUserContext();
  const { condominiumId } = user;
  const dateFormatted = format(date, "yyyy-MM-dd");

  const { data: spacesCommom, status: spacesCommumStatus } = useQuery({
    queryKey: ["spaces-commom"],
    queryFn: async () => getManagementOfCommomSpaces({ condominiumId }),
    enabled: !!condominiumId,
  });

  const { data: spacesEvents, status: spacesEventsStatus } = useQuery({
    queryKey: ["events", dateFormatted, condominiumAreaIdSelected],
    queryFn: async () =>
      fetchEventsByCondominiumArea({
        condominiumAreaIdSelected,
        date: dateFormatted,
      }),
    enabled: !!condominiumAreaIdSelected,
  });

  const { data: apartaments, status: apartamentsStatus } = useQuery({
    queryKey: ["management-commom-spaces", "apartaments"],
    queryFn: async () => fetchApartaments({ condominiumId }),
  });

  const { data: areaAvailabilityOptions } = useQuery({
    queryKey: ["options-availability", condominiumAreaIdSelected],
    queryFn: () => fetchAreaAvailability(condominiumAreaIdSelected),
    enabled: !!condominiumAreaIdSelected,
  });

  return {
    spacesCommom,
    spacesCommumStatus,
    spacesEvents,
    spacesEventsStatus,
    apartaments,
    apartamentsStatus,
    areaAvailabilityOptions,
  };
}
