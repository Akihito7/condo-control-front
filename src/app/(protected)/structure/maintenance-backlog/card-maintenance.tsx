import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import React from "react";

interface CardMaintenanceProps {
  title: string;
  icon: React.ReactNode;
  amount: number;
}

export function CardMaintenance({ title, icon, amount }: CardMaintenanceProps) {
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
