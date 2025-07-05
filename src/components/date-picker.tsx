import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { format } from "date-fns";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const dateFormmated = date
    ? `${format(date, "dd/MM/yyyy")}`
    : "Selecionar período";

  return (
    <Popover>
      <PopoverTrigger className="w-[260px] bg-white border rounded-md px-4 h-10 justify-start text-left font-normal cursor-pointer">
        {dateFormmated}
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => {
            if (value) {
              setDate(value);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
