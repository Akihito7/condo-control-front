const MOCKED_EVENTS = [
  { name: "Manutenção de bomba", dayName: "Sábado", date: "2025/11/01" },
  { name: "Manutenção de bomba", dayName: "Domingo", date: "2025/11/02" },
  {
    name: "Manutenção de bomba",
    dayName: "Segunda-feira",
    date: "2025/11/03",
  },
  { name: "Manutenção de bomba", dayName: "Terça-feira", date: "2025/11/04" },
  {
    name: "Manutenção de bomba",
    dayName: "Quarta-feira",
    date: "2025/11/05",
  },
  {
    name: "Manutenção de bomba",
    dayName: "Quinta-feira",
    date: "2025/11/06",
  },
  { name: "Manutenção de bomba", dayName: "Sexta-feira", date: "2025/11/07" },
  { name: "Manutenção de bomba", dayName: "Sábado", date: "2025/11/08" },
  { name: "Manutenção de bomba", dayName: "Domingo", date: "2025/11/09" },
  {
    name: "Manutenção de bomba",
    dayName: "Segunda-feira",
    date: "2025/11/10",
  },
  { name: "Manutenção de bomba", dayName: "Terça-feira", date: "2025/11/11" },
  {
    name: "Manutenção de bomba",
    dayName: "Quarta-feira",
    date: "2025/11/12",
  },
  {
    name: "Manutenção de bomba",
    dayName: "Quinta-feira",
    date: "2025/11/13",
  },
  { name: "Manutenção de bomba", dayName: "Sexta-feira", date: "2025/11/14" },
  { name: "Manutenção de bomba", dayName: "Sábado", date: "2025/11/15" },
  { name: "Manutenção de bomba", dayName: "Domingo", date: "2025/11/16" },
  {
    name: "Manutenção de bomba",
    dayName: "Segunda-feira",
    date: "2025/11/17",
  },
  { name: "Manutenção de bomba", dayName: "Terça-feira", date: "2025/11/18" },
  {
    name: "Manutenção de bomba",
    dayName: "Quarta-feira",
    date: "2025/11/19",
  },
  {
    name: "Manutenção de bomba",
    dayName: "Quinta-feira",
    date: "2025/11/20",
  },
  { name: "Manutenção de bomba", dayName: "Sexta-feira", date: "2025/11/21" },
  { name: "Manutenção de bomba", dayName: "Sábado", date: "2025/11/22" },
  { name: "Manutenção de bomba", dayName: "Domingo", date: "2025/11/23" },
  {
    name: "Manutenção de bomba",
    dayName: "Segunda-feira",
    date: "2025/11/24",
  },
  { name: "Manutenção de bomba", dayName: "Terça-feira", date: "2025/11/25" },
  {
    name: "Manutenção de bomba",
    dayName: "Quarta-feira",
    date: "2025/11/26",
  },
  {
    name: "Manutenção de bomba",
    dayName: "Quinta-feira",
    date: "2025/11/27",
  },
  { name: "Manutenção de bomba", dayName: "Sexta-feira", date: "2025/11/28" },
  { name: "Manutenção de bomba", dayName: "Sábado", date: "2025/11/29" },
  { name: "Manutenção de bomba", dayName: "Domingo", date: "2025/11/30" },
];

export function CalendarMaintenance() {
  const dayHeaders = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const renderDaysOut = () => {
    const firstDayOfMonth = MOCKED_EVENTS[0]?.dayName;
    const numberDaysOut = dayHeaders.findIndex(
      (dayName) => dayName === firstDayOfMonth
    );

    const daysOut = Array.from({ length: numberDaysOut });

    return daysOut.map((_, index) => (
      <div
        key={index}
        className="border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56 bg-gray-100 opacity-50"
      />
    ));
  };


  return (
    <div>
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
          {dayHeaders.map((day, i) => (
            <div key={i} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {renderDaysOut()}
          {MOCKED_EVENTS?.map((day, index) => (
            <div
              key={index}
              className="day-event-wrapper border border-gray-200 p-2 flex flex-col gap-2 min-h-56 overflow-auto max-h-56"
            >
              <span className="text-sm font-medium text-gray-700">
                {day.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
