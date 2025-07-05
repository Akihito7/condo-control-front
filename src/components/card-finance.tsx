import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface CardFinance {
  title: string;
  value: number;
  percentage: number;
  icon: React.ReactNode;
  type?: "revenue" | "expensive";
}

export function CardFinance({
  title,
  value,
  percentage,
  icon,
  type = "revenue",
}: CardFinance) {
  const moneyFormmated = value.toLocaleString("pt-br", {
    currency: "BRL",
    style: "currency",
  });

  const stylePercentage =
    type === "revenue" ? "text-green-500" : "text-red-500";

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center justify-between gap-2 w-full">
          <CardTitle className="text-md dark:text-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="text-3xl font-bold dark:text-foreground">
          {moneyFormmated}
        </span>
        <span className="text-sm font-medium text-zinc-600 dark:text-foreground">
          <span className={`${stylePercentage}`}>{percentage}%</span> Em relação
          ao período anterior
        </span>
      </CardContent>
    </Card>
  );
}
