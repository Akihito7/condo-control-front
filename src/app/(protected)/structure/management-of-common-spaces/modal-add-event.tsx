"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon, DollarSign, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CondominiumArea } from "@/api/get-management-commom-spaces";
import React, { useEffect } from "react";
import { DayWithEvents } from "@/api/fetch-events-by-condominium-area";
import { format } from "date-fns";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createSpaceEvent } from "@/api/create-space-event";
import { Apartment } from "@/api/fetch-apartaments";
import ReactSelect from "react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserContext } from "@/providers/use-user-context";
import { AreaAvailability } from "@/api/fetch-area-availability";
import { Input } from "@/components/ui/input";

interface ModalAddEventProps {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  condominiumAreaId: string;
  spacesCommom: CondominiumArea[] | undefined;
  dayWithEventSelected: DayWithEvents | undefined;
  setDayWithEventSelected: React.Dispatch<
    React.SetStateAction<DayWithEvents | undefined>
  >;
  apartaments: Apartment[] | undefined;
  areaAvailabilityOptions: AreaAvailability[] | undefined;
}

type FormValues = {
  eventDate: Date;
  apartmentId: string;
  condominiumAreaId: string;
  periodSelecteds: string[];
  guests: Guest[];
};

export interface Guest {
  name: string;
  cpf: string;
}

export function ModalAddEvent({
  open,
  setIsOpen,
  condominiumAreaId,
  spacesCommom,
  dayWithEventSelected,
  setDayWithEventSelected,
  apartaments,
  areaAvailabilityOptions,
}: ModalAddEventProps) {
  const { user } = useUserContext();
  const isResident = !!user.userAssociationApartmentId;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
    getValues,
    control,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      eventDate: new Date(),
      condominiumAreaId: condominiumAreaId,
      apartmentId: "3",
      periodSelecteds: [],
      guests: [{ name: "", cpf: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  const currentCondominiumArea = spacesCommom?.find(
    (space) => String(space.id) === condominiumAreaId,
  );

  const events = dayWithEventSelected?.events || [];

  const hoursAlreadyReserved = events.flatMap(
    (event) => event.areaAvailabilityIdSelecteds,
  );

  const date = dayWithEventSelected?.date
    ? (() => {
        const [year, month, day] = dayWithEventSelected.date.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
      })()
    : null;

  const handleClose = () => {
    setIsOpen(false);
    reset({
      apartmentId: "",
      condominiumAreaId: condominiumAreaId,
      eventDate: undefined,
      guests: [],
      periodSelecteds: [],
    });

    setDayWithEventSelected(undefined);
  };

  const onSubmit = async (data: FormValues) => {
    const dataToSend = {
      ...data,
      eventDate: dayWithEventSelected?.date as unknown as Date,
    };

    const periodsSelected = getValues("periodSelecteds");

    if (
      !periodsSelected ||
      (Array.isArray(periodsSelected) && periodsSelected.length === 0)
    )
      return alert(
        "Você precisa selecionar um período antes de criar o evento.",
      );

    await handleCreateSpaceEvent(dataToSend);
    handleClose();
  };

  const queryClient = useQueryClient();
  const { mutateAsync: handleCreateSpaceEvent } = useMutation({
    mutationFn: async (data: FormValues) => createSpaceEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["indicators-common-spaces"],
        exact: false,
      });
      queryClient.refetchQueries({
        queryKey: ["indicators-common-spaces"],
        exact: false,
      });
    },
  });

  useEffect(() => {
    reset({
      condominiumAreaId: condominiumAreaId,
      apartmentId: user.userAssociationApartmentId
        ? String(user.userAssociationApartmentId)
        : "",
      guests: [],
    });
  }, [user, condominiumAreaId]);

  const totalPeriodsSelected = watch("periodSelecteds")?.length;
  const totalPriceByPeriod = currentCondominiumArea?.hourly_rent;
  const totalPriceByAllPeriods =
    totalPeriodsSelected && totalPriceByPeriod
      ? totalPriceByPeriod * totalPeriodsSelected
      : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-full sm:max-w-[700px] md:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Adicionar Evento
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6 flex justify-between items-center bg-white shadow-md rounded-lg px-5 py-3 border border-gray-200">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Dia Selecionado</p>
              <p className="text-lg font-semibold text-gray-800">
                {date ? format(date, "dd/MM/yyyy") : "--/--/----"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Valor por Período</p>
              <p className="text-lg font-semibold text-gray-800">
                R$ {Number(currentCondominiumArea?.hourly_rent).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Valor total dos Períodos</p>
              <p className="text-lg font-semibold text-gray-800">
                {totalPriceByAllPeriods.toLocaleString("pt-BR", {
                  currency: "BRL",
                  style: "currency",
                })}
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label>Apartamentos</Label>
            <Controller
              name="apartmentId"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    value={value as string}
                    onValueChange={onChange}
                    disabled={isResident}
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Selecione um apartamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {apartaments?.map((apartament, index) => (
                        <SelectItem key={index} value={String(apartament.id)}>
                          {apartament.apartmentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label>Periodos</Label>
            <Controller
              name="periodSelecteds"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <ReactSelect
                    placeholder="Selecione os períodos desejados"
                    isMulti
                    value={value
                      ?.map((id) => {
                        const period = areaAvailabilityOptions?.find(
                          (p) => String(p.id) === String(id),
                        );
                        return period
                          ? { label: period.name, value: String(period.id) }
                          : null;
                      })
                      .filter((opt): opt is any => opt !== null)}
                    onChange={(selected) => {
                      onChange(selected.map((opt) => opt.value));
                    }}
                    options={areaAvailabilityOptions
                      ?.filter(
                        (period) => !hoursAlreadyReserved.includes(period.id),
                      )
                      .map((period) => ({
                        label: period.name,
                        value: String(period.id),
                      }))}
                  />
                );
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Convidados</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ name: "", cpf: "" })}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Convidado
            </Button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-end bg-gray-50 p-3 rounded-md border"
              >
                <div className="col-span-5">
                  <Label>Nome</Label>
                  <Input
                    {...register(`guests.${index}.name`, { required: true })}
                    placeholder="Nome do convidado"
                  />
                </div>

                <div className="col-span-5">
                  <Label>CPF</Label>
                  <Input
                    {...register(`guests.${index}.cpf`, { required: true })}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={async () => {
                      remove(index);
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-4 flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary" type="button" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Salvar Evento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
