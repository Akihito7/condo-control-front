"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

type RangeProps = {
  from: Date;
  to: Date;
};

interface DatePickRangeProps {
  range: RangeProps;
  setRange: (range: RangeProps) => void;
  children?: React.ReactNode;
  className?: string;
}

export function DatePickRange({
  range,
  setRange,
  className,
}: DatePickRangeProps) {
  const formatted =
    range.from && range.to
      ? `${format(range.from, "dd/MM/yyyy")} - ${format(
          range.to,
          "dd/MM/yyyy"
        )}`
      : "Selecionar período";

  return (
    <Popover>
      <PopoverTrigger
        className={`w-[260px] bg-white border rounded-md px-4 h-10 justify-start text-left font-normal cursor-pointer ${className}`}
      >
        {formatted}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={range}
          onSelect={(newRange) => {
            if (newRange?.from && newRange?.to) {
              setRange({ from: newRange.from, to: newRange.to });
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
