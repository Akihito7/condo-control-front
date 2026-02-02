"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { useEffect, useRef } from "react";
import { EventDetailsModal } from "./event-details-modal";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";
import { MonthYearPicker } from "@/components/month-year-select";
import { Button } from "@/components/ui/button";
import { useCondominiumSchedule } from "./use-condominium-schedule";
import { AddEventModal } from "./add-event-modal";
import { NotificationDropdown } from "@/components/notification";
import { FileDown } from "lucide-react";
import { printDocument } from "@/utils/print-document";

export default function CondominiumSchedule() {
  const { read } = userPagePermission({ pageId: 9 });
  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }

  const {
    date,
    handleDateSelected,
    condominiumSchedule,
    setModalAddEventIsOpen,
    modalAddEventIsOpen,
    setDaySelected,
    daySelected,
    eventSelected,
    setEventSelected,
    modalEventDetailsIsOpen,
    setModalEventDetailsIsOpen,
    daysOut,
    setDaysOut,
  } = useCondominiumSchedule();

  const uniqueDaysFixed = [
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
    "domingo",
  ];

  useEffect(() => {
    const uniqueDays = [
      ...new Set(condominiumSchedule?.map((day) => day.dayName)),
    ];
    const indexCurrentDay = uniqueDaysFixed.findIndex(
      (day) => day.toLowerCase() === uniqueDays?.[0]?.toLowerCase(),
    );

    if (indexCurrentDay !== -1) {
      setDaysOut(indexCurrentDay);
    }
  }, [condominiumSchedule]);

  const mainComponentRef = useRef<HTMLDivElement | null>(null);
  const filterComponentRef = useRef<HTMLDivElement | null>(null);

  const colors = [
    "bg-blue-100 text-blue-800 border-blue-300",
    "bg-green-100 text-green-800 border-green-300",
    "bg-purple-100 text-purple-800 border-purple-300",
    "bg-pink-100 text-pink-800 border-pink-300",
    "bg-yellow-100 text-yellow-800 border-yellow-300",
    "bg-red-100 text-red-800 border-red-300",
    "bg-indigo-100 text-indigo-800 border-indigo-300",
  ];

  return (
    <div
      ref={mainComponentRef}
      className="bg-gray-50 h-screen w-full p-6 md:p-10 flex flex-col gap-6 overflow-y-auto"
    >
      <EventDetailsModal
        isOpen={modalEventDetailsIsOpen}
        setIsOpen={setModalEventDetailsIsOpen}
        eventSelected={eventSelected}
        setEventSelected={setEventSelected}
      />

      <AddEventModal
        isOpen={modalAddEventIsOpen}
        setIsOpen={setModalAddEventIsOpen}
        daySelected={daySelected}
        setDaySelected={setDaySelected}
      />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Comunicação"]} />
          <div className="ml-auto">
            <NotificationDropdown />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Agenda do Condomínio
        </h1>
      </div>

      {/* Filtros e Exportação */}
      <div
        ref={filterComponentRef}
        className="flex flex-col gap-4 md:items-end md:flex-row"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o mes e ano
          </label>
          <MonthYearPicker
            selectedDate={date}
            onChange={handleDateSelected}
            justFutureMonths={false}
          />
        </div>

        <Button
          variant="outline"
          className="md:ml-auto flex items-center gap-2 h-10 cursor-pointer"
          onClick={() => {
            if (!mainComponentRef.current || !filterComponentRef.current)
              return;
            // Lógica de impressão original...
            const dayElements = document.querySelectorAll(
              ".day-event-wrapper",
            ) as NodeListOf<HTMLDivElement>;
            const buttonElements = document.querySelectorAll(
              ".button-add",
            ) as NodeListOf<HTMLButtonElement>;
            const styleBeforeChange = dayElements?.[0]?.className;
            const styleButtonBeforeChange = buttonElements?.[0]?.className;

            dayElements.forEach((el) => {
              el.className =
                "day-event-wrapper border border-gray-200 p-2 flex flex-col gap-2 min-h-56";
            });
            buttonElements.forEach((button) => {
              button.className = "hidden";
            });

            printDocument(mainComponentRef.current, filterComponentRef.current);

            dayElements.forEach((el) => {
              el.className = styleBeforeChange;
            });
            buttonElements.forEach((button) => {
              button.className = styleButtonBeforeChange;
            });
          }}
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      {/* --- VERSÃO MOBILE: CARDS VERTICAIS --- */}
      <div className="flex flex-col gap-4 md:hidden">
        {condominiumSchedule?.map((day, index) => (
          <div
            key={`mob-${index}`}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {String(day.dayNumber).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {day.dayName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDaySelected(day);
                  setModalAddEventIsOpen(true);
                }}
              >
                + Evento
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {day.events
                ?.sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime(),
                )
                .map((event) => {
                  const colorClass = colors[event.id % colors.length];
                  const startTime = new Date(
                    event.startTime,
                  ).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const endTime = new Date(event.endTime).toLocaleTimeString(
                    "pt-BR",
                    { hour: "2-digit", minute: "2-digit" },
                  );

                  return (
                    <div
                      key={event.id}
                      className={`shadow-sm rounded-xl p-3 border-l-4 transition active:scale-[0.98] cursor-pointer flex flex-col gap-1 ${colorClass}`}
                      onClick={() => {
                        setEventSelected(event);
                        setModalEventDetailsIsOpen(true);
                      }}
                    >
                      <span className="font-bold text-sm">{event.title}</span>
                      <span className="text-[11px] font-medium opacity-90">
                        {startTime} - {endTime}
                      </span>
                      {event.description && (
                        <p className="text-[11px] opacity-80 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              {day.events?.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center">
                  Nenhum evento
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- VERSÃO DESKTOP: SEU GRID ORIGINAL --- */}
      <div className="hidden md:block bg-white shadow-md rounded-xl border border-gray-200">
        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
          {uniqueDaysFixed.map((day, i) => (
            <div key={i} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: daysOut }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56 bg-gray-100 opacity-50"
            />
          ))}
          {condominiumSchedule?.map((day, index) => (
            <div
              key={index}
              className="day-event-wrapper border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56"
            >
              <span className="text-sm font-medium text-gray-700">
                {day.dayNumber}
              </span>

              <Button
                variant="outline"
                onClick={() => {
                  setDaySelected(day);
                  setModalAddEventIsOpen(true);
                }}
                className="button-add"
              >
                Adicionar Evento
              </Button>

              {day.events
                ?.sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime(),
                )
                .map((event) => {
                  const colorClass = colors[event.id % colors.length];
                  const startTime = new Date(
                    event.startTime,
                  ).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const endTime = new Date(event.endTime).toLocaleTimeString(
                    "pt-BR",
                    { hour: "2-digit", minute: "2-digit" },
                  );

                  return (
                    <div
                      key={event.id}
                      className={`shadow-sm rounded-xl p-2 hover:shadow-md transition cursor-pointer flex flex-col gap-1 border ${colorClass}`}
                      onClick={() => {
                        setEventSelected(event);
                        setModalEventDetailsIsOpen(true);
                      }}
                    >
                      <span className="font-semibold text-sm truncate">
                        {event.title}
                      </span>
                      <span className="text-[11px] text-gray-700 opacity-90">
                        {startTime} - {endTime}
                      </span>
                      {event.description && (
                        <p className="text-[11px] text-gray-600 truncate">
                          {event.description}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
