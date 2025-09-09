import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface YearSelectProps {
  yearSelected: string;
  setYearSelected: React.Dispatch<React.SetStateAction<string>>;
}
export function YearSelect({ setYearSelected, yearSelected }: YearSelectProps) {
  const years = Array.from({ length: 80 }, (_, i) => 1980 + i);

  return (
    <Select
      value={yearSelected}
      onValueChange={(value) => setYearSelected(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o ano" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
