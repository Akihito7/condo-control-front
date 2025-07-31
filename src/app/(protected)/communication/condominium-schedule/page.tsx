"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EventDetailsModal } from "./event-details-modal";
import { AddEventModal } from "./add-event-modal";

export default function CondominiumSchedule() {
  const [modalEventDetailsIsOpen, setModalEventDetailsIsOpen] = useState(false);
  const [eventSelected, setEventSelected] = useState();
  const [dateSelected, setDateSelected] = useState(new Date());

  function handleChangeDateSelected(action: "back" | "next") {
    if (action === "back") {
      const newDate = subMonths(dateSelected, 1);
      return setDateSelected(newDate);
    }

    const newDate = addMonths(dateSelected, 1);
    setDateSelected(newDate);
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full p-6 md:p-10 flex flex-col gap-6">
      <EventDetailsModal
        isOpen={modalEventDetailsIsOpen}
        setModalIsOpen={setModalEventDetailsIsOpen}
      />

      {/* Top Navigation */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Comunicação"]} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Agenda do Condomínio
        </h1>
      </div>

      {/* Calendar Container */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="border border-b-gray-100 p-2 rounded-md"
              onClick={() => handleChangeDateSelected("back")}
            >
              <ArrowLeft className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              {format(dateSelected, "MMMM yyyy", { locale: ptBR })}
            </h2>

            <div
              className="border border-b-gray-100 p-2 rounded-md"
              onClick={() => handleChangeDateSelected("next")}
            >
              <ArrowRight className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </div>

          <AddEventModal />
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, i) => (
            <div key={i} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: 31 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 p-2 flex flex-col gap-2 min-h-42"
            >
              <span className="text-sm font-medium text-gray-700">
                {index + 1}
              </span>

              {/* Events */}
              <div className="flex flex-col gap-2">
                <div
                  onClick={() => setModalEventDetailsIsOpen(true)}
                  className="bg-green-100 text-gray-800 text-xs rounded-lg px-3 py-1 cursor-pointer"
                >
                  <span className="font-semibold">Festa Junina</span>
                  <div>(18:00 - 23:00)</div>
                </div>
                <div className="bg-green-100 text-gray-800 text-xs rounded-lg px-3 py-1 cursor-pointer">
                  <span className="font-semibold">Festa Junina</span>
                  <div>(18:00 - 23:00)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
