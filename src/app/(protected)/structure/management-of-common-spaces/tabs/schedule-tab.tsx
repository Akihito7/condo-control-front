"use client";

import { Button } from "@/components/ui/button";
import React, { useMemo } from "react";
import { parse, format } from "date-fns";
import { DayWithEvents, Event } from "@/api/fetch-events-by-condominium-area";
import { Apartment } from "@/api/fetch-apartaments";

export interface ScheduleTabProps {
  spacesEvents: DayWithEvents[] | undefined;
  apartaments: Apartment[] | undefined;
  setDayWithEventSelected: React.Dispatch<React.SetStateAction<DayWithEvents | undefined>>;
  setModalAddEventIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEventSelected: React.Dispatch<React.SetStateAction<Event | undefined>>;
  setModalActionIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ScheduleTab({
  spacesEvents,
  apartaments,
  setDayWithEventSelected,
  setModalAddEventIsOpen,
  setEventSelected,
  setModalActionIsOpen,
}: ScheduleTabProps) {
  
  const uniqueDaysFixed = [
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
    "domingo",
  ];

  // Mantendo sua lógica original de busca de dias
  const uniqueDays = [...new Set(spacesEvents?.map((day) => day.dayName))];
  const daysOut = uniqueDaysFixed.indexOf(uniqueDays[0]);

  function formatTimeWithoutSeconds(time: string) {
    const parsed = parse(time, "HH:mm:ss", new Date());
    return format(parsed, "HH:mm");
  }

  return (
    <>
      {/* --- MOBILE: CARDS NA VERTICAL --- */}
      <div className="flex flex-col gap-3 md:hidden">
        {spacesEvents?.map((day, index) => (
          <div key={`mob-${index}`} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-800">
                  {day.dayNumber.toString().padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {day.dayName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDayWithEventSelected(day);
                  setModalAddEventIsOpen(true);
                }}
              >
                Agendar
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {day.events?.map((event, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setEventSelected(event);
                    setDayWithEventSelected(day);
                    setModalActionIsOpen(true);
                  }}
                  className="border border-gray-200 shadow-sm text-gray-800 text-sm rounded-lg px-4 py-3 bg-gray-50 active:bg-gray-100"
                >
                  <div className="font-semibold">
                    Apartamento: {
                      apartaments?.find((apt) => 
                        String(apt.id).toLowerCase() === String(event.apartmentId).toLowerCase()
                      )?.apartmentNumber
                    }
                  </div>
                  <div className="text-xs text-gray-600">
                    Horário: {formatTimeWithoutSeconds(event.startTime)} - {formatTimeWithoutSeconds(event.endTime)}
                  </div>
                </div>
              ))}
              {day.events?.length === 0 && (
                <p className="text-xs text-gray-400 italic">Nenhum agendamento para este dia.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP: SEU GRID ORIGINAL --- */}
      <div className="hidden md:block bg-white shadow-md rounded-xl border border-gray-200">
        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
          {uniqueDaysFixed?.map((day, i) => (
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

                {day.events?.map((event, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setEventSelected(event);
                      setDayWithEventSelected(day);
                      setModalActionIsOpen(true);
                    }}
                    className="border border-bg-gray-700 shadow-md text-gray-800 text-xs rounded-lg px-3 py-1 cursor-pointer"
                  >
                    <span className="font-semibold">
                      Apartamento :
                      {
                        apartaments?.find(
                          (apartament) =>
                            String(apartament.id).toLowerCase() ===
                            String(event.apartmentId).toLowerCase()
                        )?.apartmentNumber
                      }
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
    </>
  );
}