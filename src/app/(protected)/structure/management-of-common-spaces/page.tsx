"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useManagementOfCommomSpaces } from "./use-management-of-common-spaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parse, format } from "date-fns";
import { ModalAddEvent } from "./modal-add-event";
import { DayWithEvents, Event } from "@/api/fetch-events-by-condominium-area";
import { ModalAddGuests } from "./moda-action-event";

export default function ManagementOfCommonSpaces() {
  const [date, setDate] = useState(new Date());
  const [modalAddEventIsOpen, setModalAddEventIsOpen] = useState(false);
  const [modalActionIsOpen, setModalActionIsOpen] = useState(false);
  const [dayWithEventSelected, setDayWithEventSelected] =
    useState<DayWithEvents>();
  const [condominiumAreaIdSelected, setCondominiumAreaIdSelected] =
    useState("");
  const { spacesCommom, spacesCommumStatus, spacesEvents, spacesEventsStatus } =
    useManagementOfCommomSpaces({
      date,
      condominiumAreaIdSelected,
    });
  const [eventSelected, setEventSelected] = useState<Event>();
  useEffect(() => {
    if (Array.isArray(spacesCommom)) {
      const firstSpace = String(spacesCommom?.[0]?.id) ?? "";
      setCondominiumAreaIdSelected(firstSpace);
    }
  }, [spacesCommom]);
  const uniqueDays = [...new Set(spacesEvents?.map((day) => day.dayName))];
  function formatTimeWithoutSeconds(time: string) {
    const parsed = parse(time, "HH:mm:ss", new Date());
    return format(parsed, "HH:mm");
  }
  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-x-auto">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Espaços Comuns
        </h1>
      </div>

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o período
          </label>
          <DatePicker date={date} setDate={setDate} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione uma area
          </label>

          <Select
            value={condominiumAreaIdSelected}
            onValueChange={(value) => setCondominiumAreaIdSelected(value)}
          >
            <SelectTrigger className="col-span-3 w-[250px]">
              <SelectValue placeholder="Selecione a area" />
            </SelectTrigger>
            <SelectContent>
              {spacesCommom?.map((area) => (
                <SelectItem key={area.id} value={String(area.id)}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
          {uniqueDays?.map((day, i) => (
            <div key={i} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {spacesEvents?.map((day, index) => (
            <div
              key={index}
              className="border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56"
            >
              <span className="text-sm font-medium text-gray-700">
                {day.dayNumber.toString().padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDayWithEventSelected(day);
                    setModalAddEventIsOpen(true);
                  }}
                >
                  Agendar Evento
                </Button>

                {day.events?.map((event) => (
                  <div
                    onClick={() => {
                      setEventSelected(event);
                      setDayWithEventSelected(day);
                      setModalActionIsOpen(true);
                    }}
                    className="border border-bg-gray-700 shadow-md text-gray-800 text-xs rounded-lg px-3 py-1 cursor-pointer"
                  >
                    <span className="font-semibold">
                      Apartamento : {event.apartmentId}
                    </span>
                    <div>
                      Horario : {formatTimeWithoutSeconds(event.startTime)}-
                      {formatTimeWithoutSeconds(event.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalAddEvent
        open={modalAddEventIsOpen}
        setIsOpen={setModalAddEventIsOpen}
        condominiumAreaId={condominiumAreaIdSelected}
        spacesCommom={spacesCommom}
        dayWithEventSelected={dayWithEventSelected}
        setDayWithEventSelected={setDayWithEventSelected}
      />

      <ModalAddGuests
        eventSelected={eventSelected}
        setEventSelected={setEventSelected}
        open={modalActionIsOpen}
        setIsOpen={setModalActionIsOpen}
        dayWithEventSelected={dayWithEventSelected}
        setDayWithEventSelected={setDayWithEventSelected}
      />
    </main>
  );
}
