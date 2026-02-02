"use client";

import { MonthYearPicker } from "@/components/month-year-select";
import { useCalendarMaintenance } from "./use-calendar-maintenance";
import { ModalViewMaintenance } from "./modal-view-maintenance-event";
import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";

const DAY_HEADERS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta",
  "Sábado",
  "Domingo",
];

interface CalendarMaintenance {
  setTabSelected: Dispatch<SetStateAction<string>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export function CalendarMaintenance({
  date,
  setDate,
  setTabSelected,
}: CalendarMaintenance) {
  const dateFormatted = format(date, "yyyy-MM-dd");
  const {
    calendarMaintenances,
    calendarStatus,
    eventSelected,
    setEventSelected,
    modalIsOpen,
    setModalIsOpen,
    maintenancesStatusOptions,
  } = useCalendarMaintenance({ dateFormatted });

  const getTypeName = (typeMaintenanceId: string) => {
    return typeMaintenanceId === "1" ? "Preventiva" : "Corretiva";
  };

  const renderDaysOut = () => {
    const firstDayOfMonth = calendarMaintenances?.[0]?.dayName;
    const numberDaysOut = DAY_HEADERS.findIndex(
      (dayName) => dayName.toLowerCase() === firstDayOfMonth?.toLowerCase(),
    );

    const daysOut = Array.from({ length: numberDaysOut });
    return daysOut.map((_, index) => (
      <div
        key={index}
        className="border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56 bg-gray-100 opacity-50"
      />
    ));
  };

  const renderSkeleton = () => (
    <>
      {/* Skeleton Desktop */}
      <div className="hidden md:grid grid-cols-7">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 p-2 flex flex-col gap-3 min-h-56 bg-gray-50"
          >
            <Skeleton className="h-4 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-2/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      {/* Skeleton Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:items-end md:flex-row">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o mês e ano
          </label>
          <MonthYearPicker
            selectedDate={date}
            onChange={setDate}
            justFutureMonths={false}
          />
        </div>
      </div>

      {calendarStatus === "pending" ? (
        renderSkeleton()
      ) : (
        <>
          {/* --- VERSÃO MOBILE (CARDS) --- */}
          <div className="flex flex-col gap-3 md:hidden">
            {calendarMaintenances?.map((day, index) => (
              <div
                key={`mob-${index}`}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-gray-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-gray-500 capitalize">
                    {day.dayName}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {day.dayEvents?.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 shadow-md text-gray-800 text-sm rounded-lg px-4 py-3 bg-gray-50 active:bg-gray-100 transition-colors"
                      onClick={() => {
                        setEventSelected(event);
                        setModalIsOpen(true);
                      }}
                    >
                      <div className="font-bold mb-1 text-blue-700">
                        {event.assetsMaintenance.code}
                      </div>
                      <div className="text-xs font-medium">
                        Tipo: {getTypeName(event.typeMaintenance)}
                      </div>
                    </div>
                  ))}
                  {day.dayEvents?.length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      Sem manutenções para este dia.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* --- VERSÃO DESKTOP (GRID ORIGINAL) --- */}
          <div className="hidden md:block bg-white shadow-md rounded-xl border border-gray-200">
            <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
              {DAY_HEADERS.map((day, i) => (
                <div key={i} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {renderDaysOut()}
              {calendarMaintenances?.map((day, index) => (
                <div
                  key={index}
                  className="day-event-wrapper border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56 hover:bg-gray-50/50"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="space-y-4">
                    {day.dayEvents?.map((event) => (
                      <div
                        key={event.id}
                        className="border border-bg-gray-700 shadow-md text-gray-800 text-xs rounded-lg px-3 py-1 cursor-pointer hover:bg-white transition-colors"
                        onClick={() => {
                          setEventSelected(event);
                          setModalIsOpen(true);
                        }}
                      >
                        <span className="font-bold">
                          {event.assetsMaintenance.code} -{" "}
                        </span>
                        <span>{getTypeName(event.typeMaintenance)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <ModalViewMaintenance
        event={eventSelected}
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        setEventSelected={setEventSelected}
        statusMaintenances={maintenancesStatusOptions}
        setTabSelected={setTabSelected}
      />
    </div>
  );
}
