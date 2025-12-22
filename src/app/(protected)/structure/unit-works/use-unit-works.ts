import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchUnitWorks } from "@/api/fetch-unit-works";
import { fetchUnitWorksStatus } from "@/api/fetch-unit-works-status";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useUnitWorks() {
  const date = new Date();
  const [range, setRange] = useState({
    from: date,
    to: date,
  });

  const startDateFormatted = format(range.from, "yyyy-MM-dd");
  const endDateFormatted = format(range.to, "yyyy-MM-dd");

  const { user } = useUserContext();
  const condominiumId = user.condominiumId;

  const { data: unitWorksStatuses, status: unitWorksStatusesStatus } = useQuery(
    {
      queryKey: ["statuses"],
      queryFn: fetchUnitWorksStatus,
    }
  );

  const { data: apartaments, status: apartamentsStatus } = useQuery({
    queryKey: ["apartaments", condominiumId],
    queryFn: () => fetchApartaments({ condominiumId }),
  });

  const { data: unitWorks, status: unitWorksStatus } = useQuery({
    queryKey: ["works", startDateFormatted, endDateFormatted],
    queryFn: () =>
      fetchUnitWorks({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      }),
  });

  return {
    range,
    setRange,
    unitWorksStatuses,
    unitWorksStatusesStatus,
    apartaments,
    apartamentsStatus,
    unitWorks,
    unitWorksStatus,
  };
}
