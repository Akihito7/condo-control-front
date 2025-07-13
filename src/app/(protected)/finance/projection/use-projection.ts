import { fetchProjectionCards } from "@/api/fetch-projection-cards";
import { fetchProjectionRegisters } from "@/api/fetch-projection-registers";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";

interface UseProjectionProps {
  selectedDate: Date;
}
export function useProjection({ selectedDate }: UseProjectionProps) {
  const {
    user
  } = useUserContext();

  const condominiumId = user.condominiumId;

  const { data: cardsProjection, status: cardsProjectionStatus } = useQuery({
    queryKey: ['projectionCards', condominiumId, selectedDate],
    queryFn: async () => fetchProjectionCards({ condominiumId, date: selectedDate }),
    enabled: !!user.condominiumId && !!selectedDate
  })

  const { data: registersProjection, status: registersProjectionStatus } = useQuery({
    queryKey: ['projectionRegisters', condominiumId, selectedDate],
    queryFn: async () => fetchProjectionRegisters({ condominiumId, date: selectedDate }),
    enabled: !!user.condominiumId && !!selectedDate
  })

  return {
    cardsProjection,
    cardsProjectionStatus,
    registersProjection,
    registersProjectionStatus
  }

}