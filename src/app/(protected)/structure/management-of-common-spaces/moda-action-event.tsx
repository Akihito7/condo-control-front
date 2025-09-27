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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calendar, DollarSign, Clock } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import React, { useEffect } from "react";
import { DayWithEvents, Event } from "@/api/fetch-events-by-condominium-area";
import { format, parseISO } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSpaceEvent } from "@/api/update-space-event";
import { deleteGuestSpaceEvent } from "@/api/delete-guest-space-event";
import { deleteSpaceEvent } from "@/api/delete-space-event";
import ReactSelect from "react-select";
import { AreaAvailability } from "@/api/fetch-area-availability";
import { watch } from "fs";

export interface Guest {
  guestId?: number | null;
  name: string;
  cpf: string;
}

interface EventFormValues {
  eventId: number;
  guests: Guest[];
  periodSelecteds: string[];
}

interface ModalAddGuestsProps {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  eventSelected?: Event;
  setEventSelected: React.Dispatch<React.SetStateAction<Event | undefined>>;
  dayWithEventSelected?: DayWithEvents;
  setDayWithEventSelected: React.Dispatch<
    React.SetStateAction<DayWithEvents | undefined>
  >;
  areaAvailabilityOptions: AreaAvailability[] | undefined;
}

export function ModalAddGuests({
  open,
  setIsOpen,
  eventSelected,
  setEventSelected,
  setDayWithEventSelected,
  dayWithEventSelected,
  areaAvailabilityOptions,
}: ModalAddGuestsProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      guests: [{ guestId: null, name: "", cpf: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  const events = dayWithEventSelected?.events || [];

  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdateSpaceEvent } = useMutation({
    mutationFn: ({
      eventId,
      guests,
      periodSelectedIds,
    }: {
      eventId: number;
      guests: Guest[];
      periodSelectedIds: string[];
    }) => updateSpaceEvent({ eventId, guests, periodSelectedIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], exact: false });
    },
  });

  const { mutateAsync: handleDeleteGuest } = useMutation({
    mutationFn: (guestId: number) => deleteGuestSpaceEvent(guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], exact: false });
    },
  });

  const { mutateAsync: handleDeleteEvent } = useMutation({
    mutationFn: (eventId: number) => deleteSpaceEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], exact: false });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setDayWithEventSelected(undefined);
    setEventSelected(undefined);
    reset();
  };

  useEffect(() => {
    if (eventSelected) {
      reset({
        eventId: eventSelected.id,
        guests: eventSelected.spaceEventGuests.map((guest) => ({
          guestId: guest.id,
          name: guest.name,
          cpf: guest.cpf,
        })),
        periodSelecteds: eventSelected.areaAvailabilityIdSelecteds.map(String),
      });
    }
  }, [eventSelected, reset, setValue]);

  const onSubmit = async (data: EventFormValues) => {
    if (!eventSelected) return;

    const newGuests = data.guests.filter((guest) => {
      const cpfIsNew = eventSelected.spaceEventGuests.every(
        (g) => g.cpf.toLowerCase() !== guest.cpf.toLowerCase()
      );
      const nameIsNew = eventSelected.spaceEventGuests.every(
        (g) => g.name.toLowerCase() !== guest.name.toLowerCase()
      );
      return cpfIsNew || nameIsNew;
    });

    await handleUpdateSpaceEvent({
      eventId: eventSelected.id,
      guests: newGuests,
      periodSelectedIds: data.periodSelecteds,
    });

    handleClose();
  };

  console.log(eventSelected, events);

  const eventsWithoutEventSelected = events.filter(
    (event) => event.id !== eventSelected?.id
  );

  const hoursAlreadyReserved = eventsWithoutEventSelected.flatMap(
    (event) => event.areaAvailabilityIdSelecteds
  );

  const totalPeriodSelected = watch("periodSelecteds")?.length;
  const totalPriceByPeriod = eventSelected?.condominiumAreas?.hourlyRent;
  const totalPrice =
    totalPriceByPeriod && totalPeriodSelected
      ? totalPriceByPeriod * totalPeriodSelected
      : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Editar Evento
          </DialogTitle>
        </DialogHeader>

        {eventSelected && (
          <div className="bg-white border  shadow-sm rounded-xl p-4 mb-4 text-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Dia Selecionado</p>
                <p className="font-semibold text-gray-900">
                  {format(
                    parseISO(
                      eventSelected.eventDate as any
                    ).toISOString() as any,
                    "dd/MM/yyyy"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Horário</p>
                <p className="font-semibold text-gray-900">
                  Início:{" "}
                  {format(
                    parseISO(`1970-01-01T${eventSelected.startTime}`),
                    "HH:mm"
                  )}{" "}
                  - Fim:{" "}
                  {format(
                    parseISO(`1970-01-01T${eventSelected.endTime}`),
                    "HH:mm"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Valor por Período</p>
                <p className="font-semibold text-gray-900">
                  {totalPriceByPeriod?.toLocaleString("pt-BR", {
                    currency: "BRL",
                    style: "currency",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-500" />
              <div>
                <p className="text-xs text-gray-500">
                  Valor total dos Períodos
                </p>
                <p className="font-semibold text-gray-900">
                  {totalPrice.toLocaleString("pt-BR", {
                    currency: "BRL",
                    style: "currency",
                  })}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <DialogClose asChild>
                <Button
                  className="self-end bg-red-500"
                  variant="destructive"
                  onClick={() => {
                    handleDeleteEvent(eventSelected!.id);
                  }}
                >
                  Deletar
                </Button>
              </DialogClose>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[80vh]"
        >
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
                          (p) => String(p.id) === String(id)
                        );
                        return period
                          ? { label: period.name, value: String(period.id) }
                          : null;
                      })
                      .filter((opt): opt is any => opt !== null)}
                    onChange={(selected) => {
                      if (selected.length === 0) return;
                      onChange(selected.map((opt) => opt.value));
                    }}
                    options={areaAvailabilityOptions
                      ?.filter(
                        (period) => !hoursAlreadyReserved.includes(period.id)
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
              onClick={() => append({ guestId: null, name: "", cpf: "" })}
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
                      if (field.guestId) {
                        await handleDeleteGuest(field.guestId);
                      }
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
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
