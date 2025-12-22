import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchUnitWorksStatus } from "@/api/fetch-unit-works-status";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useUnitWorks() {
  const date = new Date();
  const [range, setRange] = useState({
    from: date,
    to: date,
  });

  const { user } = useUserContext();
  const condominiumId = user.condominiumId;

  const { data: unitWorksStatuses, status: unitWorksStatusesStatus } = useQuery(
    {
      queryKey: ["statuses"],
      queryFn: fetchUnitWorksStatus,
    }
  );

  const { data: apartaments, status: apartamentsStatus } = useQuery({
    queryKey: ["apartaments"],
    queryFn: () => fetchApartaments({ condominiumId }),
  });

  return {
    range,
    setRange,
    unitWorksStatuses,
    unitWorksStatusesStatus,
    apartaments,
    apartamentsStatus,
  };
}
