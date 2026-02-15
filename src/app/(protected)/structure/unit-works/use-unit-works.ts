import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchUnitWorks } from "@/api/fetch-unit-works";
import { fetchUnitWorksStatus } from "@/api/fetch-unit-works-status";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useUnitWorks() {
  const date = new Date();
  const [startDate, setStartDate] = useState(date);

  const startDateFormatted = format(startDate, "yyyy-MM-dd");

  const { user } = useUserContext();
  const condominiumId = user.condominiumId;

  const { data: unitWorksStatuses, status: unitWorksStatusesStatus } = useQuery(
    {
      queryKey: ["unit-works", "statuses"],
      queryFn: fetchUnitWorksStatus,
    },
  );

  const { data: apartaments, status: apartamentsStatus } = useQuery({
    queryKey: ["apartaments", condominiumId],
    queryFn: () => fetchApartaments({ condominiumId }),
  });

  const { data: unitWorks, status: unitWorksStatus } = useQuery({
    queryKey: ["unit-works", "works", startDateFormatted],
    queryFn: fetchUnitWorks,
  });

  return {
    startDate,
    setStartDate,
    unitWorksStatuses,
    unitWorksStatusesStatus,
    apartaments,
    apartamentsStatus,
    unitWorks,
    unitWorksStatus,
  };
}
