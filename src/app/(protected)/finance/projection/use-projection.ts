import { fetchProjectionCards } from "@/api/fetch-projection-cards";
import { fetchProjectionRegisters } from "@/api/fetch-projection-registers";
import { useUserContext } from "@/providers/use-user-context";
import { userPermission } from "@/utils/user-permission";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface UseProjectionProps {
  selectedDate: Date;
}
export function useProjection({ selectedDate }: UseProjectionProps) {
  const { edit, read } = userPermission({ pageId: 3 });

  if (!read) {
    redirect('/home')
  }

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