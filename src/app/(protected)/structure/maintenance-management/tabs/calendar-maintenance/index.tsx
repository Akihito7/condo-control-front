import { MonthYearPicker } from "@/components/month-year-select";
import { useCalendarMaintenance } from "./use-calendar-maintenance";
import { ModalViewMaintenance } from "./modal-view-maintenance-event";
import { Skeleton } from "@/components/ui/skeleton"; // 👈 novo componente

const DAY_HEADERS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta",
  "Sábado",
  "Domingo",
];

export function CalendarMaintenance() {
  const {
    date,
    setDate,
    calendarMaintenances,
    calendarStatus,
    eventSelected,
    setEventSelected,
    modalIsOpen,
    setModalIsOpen,
    maintenancesStatusOptions,
    maintenancesStatusOptionsStatus,
  } = useCalendarMaintenance();

  const getTypeName = (typeMaintenanceId: string) => {
    return typeMaintenanceId === "1" ? "Preventiva" : "Corretiva";
  };

  const renderDaysOut = () => {
    const firstDayOfMonth = calendarMaintenances?.[0]?.dayName;
    const numberDaysOut = DAY_HEADERS.findIndex(
      (dayName) => dayName.toLowerCase() === firstDayOfMonth?.toLowerCase()
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
    <div className="grid grid-cols-7">
      {Array.from({ length: 31 }).map((_, i) => (
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

      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
          {DAY_HEADERS.map((day, i) => (
            <div key={i} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {calendarStatus === "pending" ? (
          renderSkeleton()
        ) : (
          <div className="grid grid-cols-7">
            {renderDaysOut()}
            {calendarMaintenances?.map((day, index) => (
              <div
                key={index}
                className="day-event-wrapper border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56"
              >
                <span className="text-sm font-medium text-gray-700">
                  {String(index+1).padStart(2, "0")}
                </span>

                <div className="space-y-4">
                  {day.dayEvents?.map((event) => (
                    <div
                      key={event.id}
                      className="border border-bg-gray-700 shadow-md text-gray-800 text-xs rounded-lg px-3 py-1 cursor-pointer"
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
        )}
      </div>

      <ModalViewMaintenance
        event={eventSelected}
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        setEventSelected={setEventSelected}
        statusMaintenances={maintenancesStatusOptions}
      />
    </div>
  );
}
