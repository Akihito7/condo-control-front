"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { useEffect, useState } from "react";
import { EventDetailsModal } from "./event-details-modal";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";
import { MonthYearPicker } from "@/components/month-year-select";
import { Button } from "@/components/ui/button";
import { useCondominiumSchedule } from "./use-condominium-schedule";
import { ModalAddEvent } from "../../structure/management-of-common-spaces/modal-add-event";
import { AddEventModal } from "./add-event-modal";

export default function CondominiumSchedule() {
  const { read, edit } = userPagePermission({ pageId: 9 });

  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }
  const {
    date,
    handleDateSelected,
    condominiumSchedule,
    condominiumScheduleStatus,
    modalAddEventIsOpen,
    setModalAddEventIsOpen,
    setDaySelected,
    daySelected,
    eventSelected,
    setEventSelected,
    modalEventDetailsIsOpen,
    setModalEventDetailsIsOpen,
  } = useCondominiumSchedule();

  const uniqueDays = [
    ...new Set(condominiumSchedule?.map((day) => day.dayName)),
  ];

  return (
    <div className="bg-gray-50 h-screen w-full p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
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

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Comunicação"]} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Agenda do Condomínio
        </h1>
      </div>

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
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
      </div>

      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
          {uniqueDays.map((day, i) => (
            <div key={i} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {condominiumSchedule?.map((day, index) => (
            <div
              key={index}
              className="border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56"
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
              >
                Adicionar Evento
              </Button>

              {day.events?.map((event, index) => {
                const colors = [
                  "bg-blue-100 text-blue-800 border-blue-300",
                  "bg-green-100 text-green-800 border-green-300",
                  "bg-purple-100 text-purple-800 border-purple-300",
                  "bg-pink-100 text-pink-800 border-pink-300",
                  "bg-yellow-100 text-yellow-800 border-yellow-300",
                  "bg-red-100 text-red-800 border-red-300",
                  "bg-indigo-100 text-indigo-800 border-indigo-300",
                ];

                const colorClass = colors[event.id % colors.length];

                const startTime = new Date(event.startTime).toLocaleTimeString(
                  "pt-BR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                const endTime = new Date(event.endTime).toLocaleTimeString(
                  "pt-BR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
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
                    {/* Título */}
                    <span className="font-semibold text-sm truncate">
                      {event.title}
                    </span>

                    {/* Horário simplificado */}
                    <span className="text-[11px] text-gray-700 opacity-90">
                      {startTime} - {endTime}
                    </span>

                    {/* Descrição */}
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
