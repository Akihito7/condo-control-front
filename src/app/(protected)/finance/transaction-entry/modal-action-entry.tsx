"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Paperclip } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";

import { CategoryType } from "@/api/fecth-categories-options";
import { IncomeExpense } from "@/api/fetch-income-expense-options";
import { PaymentMethod } from "@/api/fetch-payment-method.options";
import { ApartmentWithBlock } from "@/api/fetch-apartments";
import { PaymentStatus } from "@/api/fetch-payment-status.options";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/v4";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import {
  createTransaction,
  CreateTransactionProps,
} from "@/api/create-transaction";
import { UpdateRegisteProps, updateRegister } from "@/api/update-transaction";
import { FinancialRecord } from "@/api/fetch-financial-records";
import { CurrencyInput } from "@/components/currency-input";

interface ModalCreateEntryProps {
  categoriesOptions: CategoryType[];
  incomeExpenseOptions: IncomeExpense[];
  paymentMethodsOptions: PaymentMethod[];
  apartments: ApartmentWithBlock[];
  paymentStatusOptions: PaymentStatus[];
  type: "create" | "edit";
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setTransacationSelected: (value: FinancialRecord | undefined) => void;
  transactionSelected: FinancialRecord | undefined;
  condominiumId: number;
}

const SchemaCreateEntry = z.object({
  amount: z.string(),
  amountPaid: z.string().optional(),
  condominiumId: z.coerce.number(),
  dueDate: z.date(),
  incomeExpenseId: z.coerce
    .number()
    .min(0, { message: "Tipo de registro inválido" }),
  categoryId: z.coerce.number().min(0, { message: "Categoria inválida" }),
  apartmentId: z.coerce
    .number()
    .min(-1, { message: "Apartamento inválido" })
    .optional(),
  paymentMethodId: z.coerce
    .number()
    .min(0, { message: "Forma de pagamento inválida" }),
  paymentStatusId: z.coerce
    .number()
    .min(0, { message: "Status de pagamento inválido" }),
  notes: z.string().optional(),
  recurring: z.boolean(),
  type: z.coerce.number().min(0, { message: "Tipo inválido" }),
  paymentDate: z.date().optional(),
});

export function ModalActionEntry({
  categoriesOptions,
  incomeExpenseOptions,
  paymentMethodsOptions,
  apartments,
  paymentStatusOptions,
  type,
  isOpen,
  setIsOpen,
  setTransacationSelected,
  transactionSelected,
  condominiumId,
}: ModalCreateEntryProps) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SchemaCreateEntry),
    defaultValues: {
      amount: "0",
      amountPaid: "0",
      condominiumId,
      dueDate: new Date(),
      incomeExpenseId: incomeExpenseOptions?.[0].id,
      categoryId: -1,
      apartmentId: -1,
      paymentMethodId: -1,
      paymentStatusId: -1,
      notes: "",
      recurring: false,
      type: -1,
      paymentDate: undefined,
    },
  });

  const queryClient = useQueryClient();
  const buttonCloseRef = useRef<HTMLButtonElement>(null);

  const recordTypeId = watch("incomeExpenseId");
  const categoryId = watch("categoryId");

  const categoriesFiltered = categoriesOptions.filter(
    (cat) => cat.incomeExpenseTypeId === recordTypeId
  );
  const selectedCategory = categoriesFiltered.find(
    (cat) => cat.id === categoryId
  );

  function handleChangeDueDate(date: Date) {
    setValue("dueDate", date);
  }

  function handleChangePaymentDate(date: Date) {
    setValue("paymentDate", date as any);
  }

  function handleResetForm() {
    reset({
      condominiumId: 5,
      apartmentId: -1,
      categoryId: -1,
      dueDate: new Date(),
      notes: "",
      paymentDate: undefined,
      paymentMethodId: -1,
      paymentStatusId: -1,
      incomeExpenseId: incomeExpenseOptions?.[0].id,
      recurring: false,
      type: -1,
      amount: "0",
      amountPaid: "0",
    });
  }

  const { mutateAsync: handleCreateTransaction } = useMutation({
    mutationFn: (data: CreateTransactionProps) => createTransaction(data),
    onSuccess: () => {
      handleResetForm();
      buttonCloseRef.current?.click();
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["revenueTotal"],
        exact: false,
      });
    },
  });

  const { mutateAsync: handleUpdateTransaction } = useMutation({
    mutationFn: (data: UpdateRegisteProps) => updateRegister(data),
    onSuccess: () => {
      handleResetForm();
      buttonCloseRef.current?.click();
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["revenueTotal"],
        exact: false,
      });
    },
  });

  useEffect(() => {
    const type = selectedCategory?.recordTypeId === 1 ? 1 : 2;
    setValue("type", type);
  }, [categoryId]);

  useEffect(() => {
    if (transactionSelected) {
      const dueDate = dayjs(transactionSelected.dueDate).toDate();
      const paymentDate = transactionSelected.paymentDate
        ? dayjs(transactionSelected.paymentDate).toDate()
        : undefined;
      reset({
        incomeExpenseId: transactionSelected.incomeExpenseTypeId,
        paymentStatusId: transactionSelected.paymentStatusId,
        amount: String(transactionSelected.amount),
        amountPaid: String(transactionSelected.amountPaid),
        apartmentId: transactionSelected.apartmentId,
        categoryId: transactionSelected.categoryId,
        condominiumId: transactionSelected.condominiumId,
        notes: transactionSelected.notes ?? undefined,
        paymentMethodId: transactionSelected.paymentMethodId,
        recurring: transactionSelected.isRecurring,
        dueDate,
        paymentDate,
      });
    }
  }, [type]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setTransacationSelected(undefined);
          setIsOpen(false);
          handleResetForm();
        }
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Adicionar registro
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            Adicionar registro financeiro
          </DialogTitle>
          <DialogDescription>
            Preencha o formulário para adicionar uma nova movimentação.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            if (type === "create") {
              return handleCreateTransaction(data as any);
            }
            return handleUpdateTransaction({
              ...data,
              registerId: transactionSelected!.id,
            } as any);
          })}
          className="space-y-6 py-4"
        >
  
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Informações básicas
            </legend>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Data de Vencimento</Label>
              <div className="col-span-3">
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value}
                      setDate={handleChangeDueDate}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tipo de registro</Label>
              <div className="col-span-3">
                <Controller
                  name="incomeExpenseId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        setValue("categoryId", -1);
                        setValue("type", -1);
                      }}
                    >
                      <SelectTrigger
                        className="w-[250px]"
                        style={{
                          borderColor: errors.incomeExpenseId
                            ? "#ef4444"
                            : undefined,
                        }}
                      >
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeExpenseOptions.map((opt) => (
                          <SelectItem key={opt.id} value={String(opt.id)}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.incomeExpenseId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.incomeExpenseId.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

        
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Categoria e Apartamento
            </legend>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Categoria</Label>
              <div className="col-span-3">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger
                        className="w-[250px]"
                        style={{
                          borderColor: errors.categoryId
                            ? "#ef4444"
                            : undefined,
                        }}
                      >
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesFiltered.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Apartamento</Label>
              <div className="col-span-3">
                <Controller
                  name="apartmentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-[100px]"
                        style={{
                          borderColor: errors.apartmentId
                            ? "#ef4444"
                            : undefined,
                        }}
                      >
                        <SelectValue placeholder="Selecione o apartamento (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {apartments.map((apt) => (
                          <SelectItem key={apt.id} value={String(apt.id)}>
                            {apt.apartmentNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.apartmentId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apartmentId.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

      
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Tipo e Pagamento
            </legend>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Total a pagar</Label>
              <div className="col-span-3">
                <Controller
                  name="amount"
                  control={control}
                  render={({ field: { onChange, value } }: any) => (
                    <div className="w-[250px]">
                      <CurrencyInput value={value} onChange={onChange} />{" "}
                    </div>
                  )}
                />

                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Tipo (Fixo ou Variável)</Label>
              <div className="col-span-3">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      disabled
                    >
                      <SelectTrigger
                        style={{
                          borderColor: errors.type ? "#ef4444" : undefined,
                        }}
                      >
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Fixo</SelectItem>
                        <SelectItem value="2">Variavel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Forma de Pagamento</Label>
              <div className="col-span-3">
                <Controller
                  name="paymentMethodId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-[250px]"
                        style={{
                          borderColor: errors.paymentMethodId
                            ? "#ef4444"
                            : undefined,
                        }}
                      >
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodsOptions.map((pm) => (
                          <SelectItem key={pm.id} value={String(pm.id)}>
                            {pm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentMethodId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentMethodId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Total pago</Label>
              <div className="col-span-3">
                <Controller
                  name="amountPaid"
                  control={control}
                  render={({ field: { onChange, value } }: any) => (
                    <div className="w-[250px]">
                      <CurrencyInput value={value} onChange={onChange} />{" "}
                    </div>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Data do Pagamento</Label>
              <div className="col-span-3">
                <Controller
                  name="paymentDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value as any}
                      setDate={handleChangePaymentDate}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label className="text-right">Status do Pagamento</Label>
              <div className="col-span-3">
                <Controller
                  name="paymentStatusId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-[200px]"
                        style={{
                          borderColor: errors.paymentStatusId
                            ? "#ef4444"
                            : undefined,
                        }}
                      >
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusOptions.map((ps) => (
                          <SelectItem key={ps.id} value={String(ps.id)}>
                            {ps.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentStatusId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentStatusId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Recorrente</Label>
              <div className="col-span-3">
                <input
                  type="checkbox"
                  {...register("recurring")}
                  className="w-5 h-5"
                  style={{
                    borderColor: errors.recurring ? "#ef4444" : undefined,
                  }}
                />
                {errors.recurring && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.recurring.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

  
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Informações adicionais
            </legend>

            <div className="grid grid-cols-4 items-start gap-4 mb-4">
              <Label className="text-right pt-2">Observações</Label>
              <div className="col-span-3">
                <textarea
                  {...register("notes")}
                  className="w-full resize-none border rounded-md p-2"
                  style={{ borderColor: errors.notes ? "#ef4444" : undefined }}
                  rows={3}
                  placeholder="Escreva observações aqui..."
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Anexos</Label>
              <div className="col-span-3">
                <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600">
                  <Paperclip />
                  Arraste e solte arquivos ou clique para selecionar.
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </fieldset>

          <DialogFooter>
            <DialogClose asChild>
              <Button ref={buttonCloseRef} variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
