import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchResidentCallGravities } from "@/api/fetch-resident-call-gravities";
import { fetchResidentCallStatus } from "@/api/fetch-resident-call-status";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useResidentRequests() {
  const date = new Date();
  const [range, setRange] = useState({
    from: date,
    to: date,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [requestSelected, setRequestSelected] = useState<any>(undefined);

  const { user } = useUserContext();

  const condominiumId = user.condominiumId;

  const { data: apartaments } = useQuery({
    queryKey: ["apartaments"],
    queryFn: () => fetchApartaments({ condominiumId }),
  });

  const { data: status } = useQuery({
    queryKey: ["statuses"],
    queryFn: fetchResidentCallStatus,
  });

  const { data: gravities } = useQuery({
    queryKey: ["gravities"],
    queryFn: fetchResidentCallGravities,
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
  };
}
