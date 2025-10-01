"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useManagementOfCommomSpaces } from "./use-management-of-common-spaces";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";
import { MonthYearPicker } from "@/components/month-year-select";
import { ScheduleTab } from "./tabs/schedule-tab";
import { IndicatorsTab } from "./tabs/indicators-tab";

export default function ManagementOfCommonSpaces() {
  const { read, edit } = userPagePermission({ pageId: 6 });
  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }

  const [tabSelected, setTabSelected] = useState<"schedule" | "indicators">(
    "schedule"
  );
  const [date, setDate] = useState(new Date());
  const [modalAddEventIsOpen, setModalAddEventIsOpen] = useState(false);
  const [modalActionIsOpen, setModalActionIsOpen] = useState(false);
  const [dayWithEventSelected, setDayWithEventSelected] =
    useState<DayWithEvents>();
  const [condominiumAreaIdSelected, setCondominiumAreaIdSelected] =
    useState("");
  const {
    spacesCommom,
    spacesCommumStatus,
    spacesEvents,
    spacesEventsStatus,
    apartaments,
    apartamentsStatus,
    areaAvailabilityOptions,
  } = useManagementOfCommomSpaces({
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
            Selecione o mes e ano
          </label>
          <MonthYearPicker
            selectedDate={date}
            onChange={setDate}
            justFutureMonths={false}
          />
        </div>
        {tabSelected === "schedule" && (
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
        )}
      </div>

      <Tabs
        defaultValue="schedule"
        onValueChange={(value) =>
          setTabSelected(value as "indicators" | "schedule")
        }
      >
        <TabsList className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
           Calendário de Reservas
          </TabsTrigger>
          <TabsTrigger
            value="indicators"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Indicadores
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="schedule">
            <ScheduleTab
              apartaments={apartaments}
              setDayWithEventSelected={setDayWithEventSelected}
              setEventSelected={setEventSelected}
              setModalActionIsOpen={setModalActionIsOpen}
              setModalAddEventIsOpen={setModalAddEventIsOpen}
              spacesEvents={spacesEvents}
              key={1}
            />
          </TabsContent>

          <TabsContent value="indicators">
            <IndicatorsTab date={date} setDate={setDate} />
          </TabsContent>
        </div>
      </Tabs>

      <ModalAddEvent
        open={modalAddEventIsOpen}
        setIsOpen={setModalAddEventIsOpen}
        condominiumAreaId={condominiumAreaIdSelected}
        spacesCommom={spacesCommom}
        dayWithEventSelected={dayWithEventSelected}
        setDayWithEventSelected={setDayWithEventSelected}
        apartaments={apartaments}
        areaAvailabilityOptions={areaAvailabilityOptions}
      />

      <ModalAddGuests
        eventSelected={eventSelected}
        setEventSelected={setEventSelected}
        open={modalActionIsOpen}
        setIsOpen={setModalActionIsOpen}
        dayWithEventSelected={dayWithEventSelected}
        setDayWithEventSelected={setDayWithEventSelected}
        areaAvailabilityOptions={areaAvailabilityOptions}
      />
    </main>
  );
}
