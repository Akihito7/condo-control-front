"use client";

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
import { CurrencyInput } from "@/components/currency-input";
import { CategoryType } from "@/api/fecth-categories-options";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApartmentWithBlock } from "@/api/fetch-apartments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDelinquency } from "@/api/create-delinquency";
import { useUserContext } from "@/providers/use-user-context";
import React, { useEffect, useRef } from "react";
import { Delinquency } from "@/api/fetch-delinquency-registers";
import { deleteDelinquencyRegister } from "@/api/delete-delinquency-register";
import { updateDelinquencyRegister } from "@/api/update-delinquency-register";
import { parseISO } from "date-fns";

const INCOME_TYPE_ID = 4;
interface ModalCreateDelinquencyProps {
  categoriesOptions: CategoryType[];
  apartaments: ApartmentWithBlock[];
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  delinquencySelected: Delinquency | undefined;
  setDelinquencySelected: React.Dispatch<
    React.SetStateAction<Delinquency | undefined>
  >;
  type?: "create" | "edit";
}

const SchemaDeliquency = z.object({
  dueDate: z.date().default(new Date()),
  amount: z.string(),
  amountPaid: z.string().optional(),
  paymentDate: z.date().optional().nullable(),
  apartamentId: z.string(),
  categoryId: z.string(),
});

export function ModalCreateDelinquency({
  categoriesOptions,
  apartaments,
  delinquencySelected,
  setDelinquencySelected,
  modalIsOpen,
  setModalIsOpen,
  type = "create",
}: ModalCreateDelinquencyProps) {
  const buttonCloseRef = useRef<HTMLButtonElement>(null);

  const { user } = useUserContext();

  const queryClient = useQueryClient();

  const condominiumId = user.condominiumId;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SchemaDeliquency),
  });

  const categoriesFiltered = categoriesOptions.filter(
    (category) => category.incomeExpenseTypeId === INCOME_TYPE_ID
  );

  async function handleSubmitDeliquency(data: any) {
    if (type === "create") {
      handleCreateDelinquency({ condominiumId, ...data });
    }

    if (type === "edit") {
      handleUpdateDelinquency(data);
    }
  }

  const { mutateAsync: handleCreateDelinquency } = useMutation({
    mutationFn: (data: any) => createDelinquency(data),
    onSuccess: () => {
      buttonCloseRef?.current?.click();
      queryClient.invalidateQueries({
        queryKey: ["delinquencyRegisters"],
        exact: false,
      });
    },
  });

  const { mutateAsync: handleUpdateDelinquency } = useMutation({
    mutationFn: (data: any) =>
      updateDelinquencyRegister({
        ...data,
        delinquencyId: delinquencySelected!.id,
      }),
    onSuccess: () => {
      buttonCloseRef?.current?.click();
      queryClient.invalidateQueries({
        queryKey: ["delinquencyRegisters"],
        exact: false,
      });
    },
  });

  function handleResetForm() {
    reset({
      amount: "0",
      amountPaid: "0",
      apartamentId: "0",
      categoryId: "0",
      dueDate: new Date(),
      paymentDate: null as unknown as undefined,
    });
  }

  useEffect(() => {
    if (!delinquencySelected) {
      handleResetForm();
      return;
    }

    const {
      amount,
      amountPaid,
      apartamentId,
      categoryId,
      categoryName,
      condominiumId,
      createdAt,
      paymentDate,
      dueDate,
    } = delinquencySelected;

    const dueDateFormmated = parseISO(dueDate) ?? new Date();
    const paymentDateFormmated = paymentDate
      ? parseISO(paymentDate)
      : undefined;
    reset({
      amount: String(amount),
      amountPaid: String(amountPaid),
      apartamentId: String(apartamentId),
      categoryId: String(categoryId),
      dueDate: dueDateFormmated,
      paymentDate: paymentDateFormmated,
    });
  }, [delinquencySelected]);

  return (
    <Dialog
      open={modalIsOpen}
      onOpenChange={(open) => {
        setModalIsOpen(open);
        if (!open) {
          if (delinquencySelected) setDelinquencySelected(undefined);
          handleResetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Registrar Inadimplência</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {type === "create"
              ? "Adicionar Inadimplência"
              : "Editar Inadimplência"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da inadimplência abaixo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitDeliquency)}
          className="space-y-6 py-4"
        >
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Dados da Inadimplência
            </legend>

            <div className="grid grid-cols-4 items-center gap-4 mb-4 ">
              <Label htmlFor="apartment" className="text-right">
                Apartamento
              </Label>
              <Controller
                name="apartamentId"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="col-span-3 w-[150px]">
                      <SelectValue placeholder="Selecione o apartamento." />
                    </SelectTrigger>
                    <SelectContent>
                      {apartaments.map((apartament, index) => (
                        <SelectItem key={index} value={String(apartament.id)}>
                          {apartament.apartmentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="col-span-3 w-[250px] focus:border-blue-500">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesFiltered.map((category, index) => (
                        <SelectItem key={index} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="dueDate" className="text-right">
                Data de Vencimento
              </Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker date={value!} setDate={onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="amount" className="text-right">
                Valor (R$)
              </Label>
              <Controller
                name="amount"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput value={value} onChange={onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="paymentDate" className="text-right">
                Data do Pagamento
              </Label>
              <Controller
                name="paymentDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker date={value!} setDate={onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="amount" className="text-right">
                Valor Pago (R$)
              </Label>
              <Controller
                name="amountPaid"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput value={value} onChange={onChange} />
                )}
              />
            </div>
          </fieldset>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" type="button" ref={buttonCloseRef}>
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
