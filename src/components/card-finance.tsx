import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { CardFinanceSkeleton } from "./card-finance-skeleton";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CurrencyInput } from "./currency-input";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";

interface CardFinance {
  title: string;
  value: number;
  icon: React.ReactNode;
  type?: "revenue" | "expensive" | "balance";
  isLoading?: boolean;
  target: number | undefined;
  isSameMonth: boolean;
}

const SchemaFormFinanace = z.object({
  value: z.string().optional(),
  target: z.string().optional(),
});

export function CardFinance({
  title,
  value,
  icon,
  type = "balance",
  isLoading,
  target,
  isSameMonth,
}: CardFinance) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SchemaFormFinanace),
  });

  const moneyFormmated = value.toLocaleString("pt-br", {
    currency: "BRL",
    style: "currency",
  });
  let styleTitle = "";
  const modalTitle = type === "revenue" ? "Editar Receitas" : "Editar Despesas";

  const isRevenue = type === "revenue";
  const isExpense = type === "expensive";

  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  async function handleUpdate(data: any) {
    console.log("its me data", data);
  }

  function handleResetForm() {
    reset({
      value: "",
      target: "",
    });
  }

  return (
    <Dialog
      open={isSameMonth && modalIsOpen}
      onOpenChange={(value) => {
        if (!value && isSameMonth && type !== "balance") {
          handleResetForm();
          setModalIsOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Card
          className="cursor-pointer"
          onClick={() => {
            if (isSameMonth && type !== "balance") {
              reset({
                value: String(value),
                target: String(target),
              });
              setModalIsOpen(true);
            }
          }}
        >
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
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-md dark:text-foreground">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Valor Manual</label>
          <Controller
            name="value"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CurrencyInput onChange={onChange} value={value} />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Meta</label>

          <Controller
            name="target"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CurrencyInput onChange={onChange} value={value} />
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit(handleUpdate)}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
