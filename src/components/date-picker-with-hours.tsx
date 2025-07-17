"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithHoursProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function DatePickerWithHours({
  date,
  setDate,
}: DatePickerWithHoursProps) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState("00:00:00");

  React.useEffect(() => {
    if (date) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    }
  }, [date]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (date) {
      const [hours, minutes, seconds] = newTime.split(":").map(Number);
      const updatedDate = new Date(date);
      updatedDate.setHours(hours, minutes, seconds || 0);
      setDate(updatedDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const [hours, minutes, seconds] = time.split(":").map(Number);
    selectedDate.setHours(hours, minutes, seconds || 0);
    setDate(selectedDate);
    setOpen(false);
  };

  return (
    <div className="flex gap-4">
      {/* Date Picker */}
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  );
}
