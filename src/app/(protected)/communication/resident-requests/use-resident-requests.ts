import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchResidentCallGravities } from "@/api/fetch-resident-call-gravities";
import { fetchResidentCallStatus } from "@/api/fetch-resident-call-status";
import { fetchResidentCalls } from "@/api/fetch-resident-calls";
import { fetchResidentRequestCards } from "@/api/fetch-resident-request-cards";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useResidentRequests() {
  const date = new Date();
  const [range, setRange] = useState({
    from: date,
    to: date,
  });

  const startDateFormatted = format(range.from, "yyyy-MM-dd");
  const endDateFormatted = format(range.to, "yyyy-MM-dd");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [requestSelected, setRequestSelected] = useState<any>(undefined);
  const [apartamentIdSelected, setApartamentIdSelected] =
    useState<string>("-1");
  const [statusIdSelected, setStatusIdSelected] = useState<string>("-1");

  const { user } = useUserContext();

  const condominiumId = user.condominiumId;

  const { data: apartaments } = useQuery({
    queryKey: ["apartaments"],
    queryFn: () => fetchApartaments({ condominiumId }),
  });

  const { data: status } = useQuery({
    queryKey: ["statuses", "residents", "requests"],
    queryFn: fetchResidentCallStatus,
  });

  const { data: gravities } = useQuery({
    queryKey: ["gravities"],
    queryFn: fetchResidentCallGravities,
  });

  const { data: residentCalls } = useQuery({
    queryKey: [
      "resident-calls",
      condominiumId,
      startDateFormatted,
      endDateFormatted,
    ],
    queryFn: () =>
      fetchResidentCalls({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      }),
  });

  const { data: cards, status: cardsStatus } = useQuery({
    queryKey: ["resident-calls", "cards", startDateFormatted, endDateFormatted],
    queryFn: () =>
      fetchResidentRequestCards({
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      }),
  });

  return {
    range,
    setRange,
    apartaments,
    modalIsOpen,
    setModalIsOpen,
    requestSelected,
    setRequestSelected,
    status,
    gravities,
    residentCalls,
    apartamentIdSelected,
    setApartamentIdSelected,
    setStatusIdSelected,
    statusIdSelected,
    cards,
    cardsStatus,
  };
}
