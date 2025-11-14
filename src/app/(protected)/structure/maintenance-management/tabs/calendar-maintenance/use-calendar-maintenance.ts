import { DayEvent, fetchCalendarMaintenances } from "@/api/fetch-calendar-maintenances";
import { fetchMaintenancesStatus } from "@/api/fetch-maintenances-status";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useCalendarMaintenance() {
  const [date, setDate] = useState(new Date());
  const [eventSelected, setEventSelected] = useState<DayEvent | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const dateFormatted = format(date, 'yyyy-MM-dd')

  const { user } = useUserContext();
  const { condominiumId } = user;

  const { data: calendarMaintenances, status: calendarStatus } = useQuery({
    queryKey: ['maintenances-calendar', condominiumId, dateFormatted],
    queryFn: () => fetchCalendarMaintenances(dateFormatted),
    enabled: !!dateFormatted
  })

    const { data: maintenancesStatusOptions, status: maintenancesStatusOptionsStatus } = useQuery({
    queryKey: ['status-options'],
    queryFn: fetchMaintenancesStatus,
    enabled: !!condominiumId
  })


  return {
    date,
    setDate,
    calendarMaintenances,
    calendarStatus,
    eventSelected,
    setEventSelected,
    modalIsOpen,
    setModalIsOpen,
    maintenancesStatusOptions,
    maintenancesStatusOptionsStatus
  }
}