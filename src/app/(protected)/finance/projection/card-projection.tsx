import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface CardProjectionProps {
  title: string;
  amount: number;
  icon?: React.ReactNode;
}
export function CardProjection({ title, icon, amount }: CardProjectionProps) {
  return (
    <Card className="min-w-[210px] max-w-[350px]cursor-pointer">
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
          {amount.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
          })}
        </span>
      </CardContent>
    </Card>
  );
}
