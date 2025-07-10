import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { CardFinanceSkeleton } from "./card-finance-skeleton";

interface CardFinance {
  title: string;
  value: number;
  icon: React.ReactNode;
  type?: "revenue" | "expensive" | "balance";
  isLoading?: boolean;
  target: number | undefined;
  isSameMonth: boolean;
}

export function CardFinance({
  title,
  value,
  icon,
  type = "balance",
  isLoading,
  target,
  isSameMonth,
}: CardFinance) {
  const moneyFormmated = value.toLocaleString("pt-br", {
    currency: "BRL",
    style: "currency",
  });
  let styleTitle = "";

  const isRevenue = type === "revenue";
  const isExpense = type === "expensive";

  if (!target) {
    if (value === 0) {
    } else {
      styleTitle = isRevenue
        ? "text-green-500"
        : isExpense
        ? "text-red-500"
        : "";
    }
  } else {
    if (isRevenue) {
      styleTitle = value > target ? "text-green-500" : "text-red-500";
    }
    if (isExpense) {
      styleTitle = value < target ? "text-green-500" : "text-red-500";
    }
  }

  if (isLoading) {
    return <CardFinanceSkeleton />;
  }

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
        <span
          className={`text-3xl font-bold dark:text-foreground ${styleTitle}`}
        >
          {moneyFormmated}
        </span>

        {isSameMonth && target && target > 0 && (
          <span className="text-sm font-medium text-zinc-600 dark:text-foreground">
            Meta{" "}
            {target?.toLocaleString("pt-br", {
              currency: "BRL",
              style: "currency",
            })}
          </span>
        )}

        {isSameMonth && !target && (
          <span className="text-sm font-medium text-zinc-600 dark:text-foreground">
            Sem metas para este mês
          </span>
        )}
      </CardContent>
    </Card>
  );
}
