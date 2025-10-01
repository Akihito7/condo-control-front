"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import { DayWithEvents, Event } from "@/api/fetch-events-by-condominium-area";

import { Apartment } from "@/api/fetch-apartaments";

export interface ScheduleTabProps {
  spacesEvents: DayWithEvents[] | undefined;
  apartaments: Apartment[] | undefined;
  setDayWithEventSelected: React.Dispatch<
    React.SetStateAction<DayWithEvents | undefined>
  >;
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
  const uniqueDays = [...new Set(spacesEvents?.map((day) => day.dayName))];
  function formatTimeWithoutSeconds(time: string) {
    const parsed = parse(time, "HH:mm:ss", new Date());
    return format(parsed, "HH:mm");
  }
  return (
    <>
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
