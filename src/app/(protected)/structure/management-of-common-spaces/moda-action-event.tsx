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
import { useForm, useFieldArray } from "react-hook-form";
import React, { useEffect, useState, useMemo } from "react";
import { DayWithEvents, Event } from "@/api/fetch-events-by-condominium-area";
import { format, parseISO } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSpaceEvent } from "@/api/update-space-event";
import { deleteGuestSpaceEvent } from "@/api/delete-guest-space-event";
import { cn } from "@/lib/utils";
import { deleteSpaceEvent } from "@/api/delete-space-event";

export interface Guest {
  guestId?: number | null;
  name: string;
  cpf: string;
}

interface EventFormValues {
  eventId: number;
  timeBlocks: string[];
  startTime: string;
  endTime: string;
  guests: Guest[];
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
}

const generateTimeBlocks = () =>
  Array.from(
    { length: 24 },
    (_, hour) => `${hour.toString().padStart(2, "0")}:00`
  );

export function ModalAddGuests({
  open,
  setIsOpen,
  eventSelected,
  setEventSelected,
  setDayWithEventSelected,
  dayWithEventSelected,
}: ModalAddGuestsProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      guests: [{ guestId: null, name: "", cpf: "" }],
      timeBlocks: [],
      startTime: "",
      endTime: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const timeBlocks = useMemo(() => generateTimeBlocks(), []);
  const events = dayWithEventSelected?.events || [];

  const blockedBlocks = useMemo(() => {
    const blocked: Set<string> = new Set();
    events.forEach((event) => {
      const startHour = parseInt(event.startTime.split(":")[0], 10);
      const endHour = parseInt(event.endTime.split(":")[0], 10);

      for (let hour = startHour; hour < endHour; hour++) {
        const block = `${hour.toString().padStart(2, "0")}:00`;
        if (event.id !== eventSelected?.id) {
          blocked.add(block);
        }
      }
    });
    return Array.from(blocked);
  }, [events, eventSelected]);

  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdateSpaceEvent } = useMutation({
    mutationFn: ({
      eventId,
      guests,
      startTime,
      endTime,
    }: {
      eventId: number;
      guests: Guest[];
      startTime: string;
      endTime: string;
    }) => updateSpaceEvent({ eventId, guests, startTime, endTime }),
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
    setSelectedBlocks([]);
    reset();
  };

  useEffect(() => {
    if (eventSelected) {
      const blocks = [];
      const startHour = parseInt(eventSelected.startTime.split(":")[0], 10);
      const endHour = parseInt(eventSelected.endTime.split(":")[0], 10);

      for (let hour = startHour; hour < endHour; hour++) {
        blocks.push(`${hour.toString().padStart(2, "0")}:00`);
      }

      setSelectedBlocks(blocks);
      setValue("timeBlocks", blocks);

      const lastIndex = timeBlocks.indexOf(blocks[blocks.length - 1]);
      setValue("startTime", blocks[0]);
      setValue("endTime", timeBlocks[lastIndex + 1] || "23:59");

      reset({
        eventId: eventSelected.id,
        guests: eventSelected.spaceEventGuests.map((guest) => ({
          guestId: guest.id,
          name: guest.name,
          cpf: guest.cpf,
        })),
        timeBlocks: blocks,
        startTime: blocks[0],
        endTime: timeBlocks[lastIndex + 1] || "23:59",
      });
    }
  }, [eventSelected, reset, setValue, timeBlocks]);

  const handleBlockClick = (block: string) => {
    if (blockedBlocks.includes(block)) return;

    let updated = selectedBlocks.includes(block)
      ? selectedBlocks.filter((b) => b !== block)
      : [...selectedBlocks, block].sort();

    const blockIndexes = updated.map((b) => timeBlocks.indexOf(b));
    const isConsecutive = blockIndexes.every(
      (val, i, arr) => i === 0 || val === arr[i - 1] + 1
    );

    if (isConsecutive) {
      setSelectedBlocks(updated);
      setValue("timeBlocks", updated);

      const firstBlock = updated[0];
      const lastBlock = updated[updated.length - 1];
      const lastIndex = timeBlocks.indexOf(lastBlock);

      setValue("startTime", firstBlock);
      setValue("endTime", timeBlocks[lastIndex + 1] || "23:59");
    }
  };

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
      startTime: data.startTime,
      endTime: data.endTime,
      eventId: eventSelected.id,
      guests: newGuests,
    });

    handleClose();
  };

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
                  {format(new Date(eventSelected.eventDate), "dd/MM/yyyy")}
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
                <p className="text-xs text-gray-500">Valor por Hora</p>
                <p className="font-semibold text-gray-900">R$ 100,00</p>
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
            <Label>Horários Disponíveis</Label>
            <div className="grid grid-cols-4 gap-2">
              {timeBlocks.map((block) => (
                <button
                  type="button"
                  key={block}
                  className={cn(
                    "border rounded px-2 py-1 text-sm",
                    blockedBlocks.includes(block)
                      ? "bg-red-200 text-gray-500 cursor-not-allowed"
                      : selectedBlocks.includes(block)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                  disabled={blockedBlocks.includes(block)}
                  onClick={() => handleBlockClick(block)}
                >
                  {block}
                </button>
              ))}
            </div>
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
