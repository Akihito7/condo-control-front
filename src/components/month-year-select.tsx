"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { format, parse, startOfMonth, addYears } from "date-fns";
import { ptBR } from "date-fns/locale";

const months = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString("default", { month: "long" })
);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

interface MonthYearPickerProps {
  selectedDate: Date;
  onChange: (value: Date) => void;
  justFutureMonths?: boolean;
}

export function MonthYearPicker({
  selectedDate,
  onChange,
  justFutureMonths = false,
}: MonthYearPickerProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    onChange(new Date(selectedYear, selectedMonth));
  }, [selectedMonth, selectedYear]);

  function isFutureOrCurrentMonth(month: string) {
    const currentYear = new Date().getFullYear();
    const input = `${month}/${currentYear}`;

    const parsedDate = parse(input.trim(), "MMMM/yyyy", new Date(), {
      locale: ptBR,
    });

    const currentDate = new Date();

    const parsedDateStartsMonth = startOfMonth(parsedDate);
    const currentDateStartsMonth = startOfMonth(currentDate);

    return parsedDateStartsMonth < currentDateStartsMonth;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between h-10">
          {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex gap-2 p-4 w-[250px]">
        <Select
          value={selectedMonth.toString()}
          onValueChange={(val) => setSelectedMonth(parseInt(val))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem
                key={index}
                value={index.toString()}
                disabled={justFutureMonths && isFutureOrCurrentMonth(month)}
              >
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedYear.toString()}
          onValueChange={(val) => setSelectedYear(parseInt(val))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
}
