import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import React, { useState } from "react";

interface OpeningCard {
  title: string;
  icon: React.ReactNode;
  value: number;
  isHours?: boolean;
}

export function OpeningCard({
  title,
  icon,
  value,
  isHours = false,
}: OpeningCard) {
  const [formatHoursType, setFormatHoursType] = useState<"normal" | "00:00">(
    "normal"
  );

  const formatHours = (hoursDecimal: number) => {
    const hours = Math.floor(hoursDecimal);
    const minutes = Math.round((hoursDecimal - hours) * 60);

    if (formatHoursType === "normal") {
      return `${hours}h ${minutes}min`;
    } else {
      const hh = String(hours).padStart(2, "0");
      const mm = String(minutes).padStart(2, "0");
      return `${hh}:${mm}`;
    }
  };

  function toggleTypeHours() {
    if (formatHoursType === "normal") {
      return setFormatHoursType("00:00");
    }
    setFormatHoursType("normal");
  }

  return (
    <Card className="min-w-[210px] max-w-[350px]cursor-pointer flex justify-between">
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center justify-between gap-2 w-full">
          <CardTitle className="text-md dark:text-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className={`text-2xl md:text-3xl font-bold dark:text-foreground`}>
          {isHours ? formatHours(value) : value?.toFixed(0)}{" "}
          {isHours && (
            <Button
              onClick={toggleTypeHours}
              size="icon"
              variant="ghost"
              className="h-8 w-8 cursor-pointer"
            >
              <Clock className="h-5 w-5" />
            </Button>
          )}
        </span>
      </CardContent>
    </Card>
  );
}
