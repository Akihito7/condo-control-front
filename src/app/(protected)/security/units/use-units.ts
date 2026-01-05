import { fetchApartaments } from "@/api/fetch-apartaments";
import { fetchBlocks } from "@/api/fetch-blocks";
import { fetchSecurityUnits } from "@/api/fetch-security-units";
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

  const [search, setSearch] = useState("");
  const [statusIdSelected, setStatusIdSelected] = useState("-1");
  const [unitSelected, setUnitSelected] = useState(undefined);

  const { user } = useUserContext();

  const condominiumId = user.condominiumId;

  const { data: apartaments } = useQuery({
    queryKey: ["apartaments", condominiumId],
    queryFn: ({ queryKey: [_, condominiumId] }) =>
      fetchApartaments({ condominiumId: condominiumId as number }),
    enabled: !!condominiumId,
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: fetchUnitStatuses,
  });

  const { data: units, status: unitsStatus } = useQuery({
    queryKey: ["units"],
    queryFn: fetchSecurityUnits,
  });

  const { data: blocks } = useQuery({
    queryKey: ["blocks"],
    queryFn: fetchBlocks,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  return {
    range,
    setRange,
    modalIsOpen,
    setModalIsOpen,
    apartaments,
    statuses,
    units,
    unitsStatus,
    blocks: blocks?.map(({ id, name }: any) => ({ id, name })),
    search,
    setSearch,
    statusIdSelected,
    setStatusIdSelected,
    unitSelected,
    setUnitSelected,
  };
}
