import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";

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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCondominiumIncomes } from "@/api/update-condominium-incomes";
import { format } from "date-fns";
import { useUserContext } from "@/providers/use-user-context";
import { updateCondominiumExpenses } from "@/api/update-condominium-expenses";
import { redefineIncomesExpensesToCalculated } from "@/api/redefine-incomes-expenses-to-calculated";

interface CardFinance {
  title: string;
  value: number;
  icon: React.ReactNode;
  type?: "income" | "expensive" | "balance";
  target: number | undefined;
  isSameMonth: boolean;
  date: Date;
}

const SchemaFormFinanace = z.object({
  value: z.string().optional(),
  target: z.string().optional(),
});

type FormFinanceData = z.infer<typeof SchemaFormFinanace>;

export function CardFinance({
  title,
  value,
  icon,
  type = "balance",
  target,
  isSameMonth,
  date,
}: CardFinance) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFinanceData>({
    resolver: zodResolver(SchemaFormFinanace),
  });

  const { user } = useUserContext();
  const queryClient = useQueryClient();

  const dateFormmated = format(date, '"yyyy-MM"');

  const { mutateAsync: handleUpdateCondominiumIncomes } = useMutation({
    mutationFn: (data: FormFinanceData) =>
      updateCondominiumIncomes({
        date: dateFormmated,
        income: data.value,
        targetIncome: data.target,
        condominiumId: user.condominiumId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["revenueTotal"],
        exact: false,
      });
      setModalIsOpen(false);
    },
  });

  const { mutateAsync: handleUpdateCondominiumExpenses } = useMutation({
    mutationFn: (data: FormFinanceData) =>
      updateCondominiumExpenses({
        date: dateFormmated,
        expenses: data.value,
        targetExpenses: data.target,
        condominiumId: user.condominiumId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["revenueTotal"],
        exact: false,
      });
      setModalIsOpen(false);
    },
  });

  const { mutateAsync: handleRedefineForCalculated } = useMutation({
    mutationFn: () =>
      redefineIncomesExpensesToCalculated({
        date: dateFormmated,
        condominiumId: user.condominiumId,
        type: type as "income" | "expenses",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["revenueTotal"],
        exact: false,
      });
      setModalIsOpen(false);
    },
  });

  async function handleUpdate(data: FormFinanceData) {
    if (type === "income") {
      handleUpdateCondominiumIncomes(data);
    }

    if (type === "expensive") {
      handleUpdateCondominiumExpenses(data);
    }
  }

  function handleResetForm() {
    reset({
      value: "",
      target: "",
    });
  }

  async function handleRedefine() {
    await handleRedefineForCalculated();
  }
  const moneyFormmated = value.toLocaleString("pt-br", {
    currency: "BRL",
    style: "currency",
  });

  let styleTitle = "";

  const modalTitle = type === "income" ? "Editar Receitas" : "Editar Despesas";

  const isRevenue = type === "income";
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

          <span
            onClick={handleRedefine}
            className="text-blue-600 text-sm font-medium cursor-pointer"
          >
            Redefinir para calculado
          </span>
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
