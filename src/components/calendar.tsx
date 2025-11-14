import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

interface CalendarCustomProps {
  date: Date;
  setDate: (date: Date) => void;
  label?: string;
  disabled?: boolean;
}

export function CalendarCustom({
  date,
  setDate,
  label = "Selecionar período",
  disabled = false,
}: CalendarCustomProps) {
  const dateFormmated = date ? `${format(date, "dd/MM/yyyy")}` : label;
  const isPlaceholder = !date;

  return (
    <Popover>
      <PopoverTrigger
        className={`w-[260px] bg-white border rounded-md px-4 h-9 text-sm flex items-center justify-start text-left font-normal cursor-pointer ${
          isPlaceholder ? "text-gray-500" : "text-black"
        }`}
      >
        {dateFormmated}
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => {
            if (value) {
              setDate(value);
            }
          }}
          captionLayout="dropdown"
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
