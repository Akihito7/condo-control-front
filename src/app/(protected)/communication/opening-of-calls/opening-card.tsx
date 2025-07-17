import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface OpeningCard {
  title: string;
  icon: React.ReactNode;
  value: number;
}

export function OpeningCard({ title, icon, value }: OpeningCard) {
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
          {value.toFixed(0)}
        </span>
      </CardContent>
    </Card>
  );
}
