import { DaySchedule, Event, fetchCondominiumSchedule } from "@/api/fetch-condominium-schedule";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useCondominiumSchedule() {

  const [date, setDate] = useState(new Date());
  const [modalAddEventIsOpen, setModalAddEventIsOpen] = useState(false);
  const [daySelected, setDaySelected] = useState<DaySchedule>();
  const [modalEventDetailsIsOpen, setModalEventDetailsIsOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState<Event | undefined>();
  const dateFormatted = format(date, 'yyyy-MM-dd')

  function handleDateSelected(date: Date) {
    setDate(date)
  }

  const { user } = useUserContext();
  const { condominiumId } = user;

  const { data: condominiumSchedule, status: condominiumScheduleStatus } = useQuery({
    queryKey: ['condominium-schedule', dateFormatted],
    queryFn: () => fetchCondominiumSchedule({ condominiumId, date: dateFormatted }),
    enabled: !!condominiumId && !!dateFormatted
  })

  return {
    date,
    handleDateSelected,
    condominiumSchedule,
    condominiumScheduleStatus,
    modalAddEventIsOpen,
    setModalAddEventIsOpen,
    daySelected,
    setDaySelected,
    modalEventDetailsIsOpen,
    setModalEventDetailsIsOpen,
    eventSelected,
    setEventSelected
  }
}