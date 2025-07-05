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
      <PopoverTrigger>
        <Button
          variant="outline"
          className="w-[260px] h-10 justify-start text-left font-normal"
        >
          {dateFormmated}
        </Button>
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
