import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchUnitStatuses } from "@/api/fetch-unit-statuses";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useUnits() {
  const date = new Date();
  const [range, setRange] = useState({
    from: date,
    to: date,
  });

  const { user } = useUserContext();

  const condominiumId = user.condominiumId;

  const { data: apartaments } = useQuery({
    queryKey: ["apartaments", condominiumId],
    queryFn: ({ queryKey: [_, condominiumId] }) =>
      fetchApartaments({ condominiumId: condominiumId as number }),
     enabled : !!condominiumId
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: fetchUnitStatuses,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  return {
    range,
    setRange,
    modalIsOpen,
    setModalIsOpen,
    apartaments,
    statuses,
  };
}
