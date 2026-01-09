import { fetchProjectionCards } from "@/api/fetch-projection-cards";
import { fetchProjectionRegisters } from "@/api/fetch-projection-registers";
import { useUserContext } from "@/providers/use-user-context";
import { userPagePermission } from "@/utils/user-page-permission";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface UseProjectionProps {
  selectedDate: Date;
  selectedDateFormatted: string;
}
export function useProjection({
  selectedDate,
  selectedDateFormatted,
}: UseProjectionProps) {
  const { edit, read } = userPagePermission({ pageId: 3 });

  const { user } = useUserContext();

  const condominiumId = user.condominiumId;

  const { data: cardsProjection, status: cardsProjectionStatus } = useQuery({
    queryKey: ["projectionCards", condominiumId, selectedDateFormatted],
    queryFn: async () =>
      fetchProjectionCards({ condominiumId, date: selectedDateFormatted }),
    enabled: !!user.condominiumId && !!selectedDateFormatted,
  });

  const { data: registersProjection, status: registersProjectionStatus } =
    useQuery({
      queryKey: ["projectionRegisters", condominiumId, selectedDate],
      queryFn: async () =>
        fetchProjectionRegisters({ condominiumId, date: selectedDate }),
      enabled: !!user.condominiumId && !!selectedDate,
    });

  return {
    cardsProjection,
    cardsProjectionStatus,
    registersProjection,
    registersProjectionStatus,
  };
}
