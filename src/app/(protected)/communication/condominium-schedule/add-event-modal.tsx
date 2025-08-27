"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DaySchedule } from "@/api/fetch-condominium-schedule";
import { useMutation } from "@tanstack/react-query";
import { createEventCondominium } from "@/api/create-event-condominium";

interface AddEventModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  daySelected: DaySchedule | undefined;
  setDaySelected: React.Dispatch<React.SetStateAction<DaySchedule | undefined>>;
}

interface EventFormValues {
  title: string;
  type: string;
  location: string;
  startTime: string;
  endTime: string;
  date: string;
  description: string;
}

export function AddEventModal({
  isOpen,
  setIsOpen,
  daySelected,
  setDaySelected,
}: AddEventModalProps) {
  const { register, handleSubmit, reset, setValue } =
    useForm<EventFormValues>();

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    handleCreateEvent(data);
    reset();
    setIsOpen(false);
  };

  const { mutateAsync: handleCreateEvent } = useMutation({
    mutationFn: (data: EventFormValues) => createEventCondominium({ data }),
    onSuccess: (data) => {
      const events = daySelected?.events ?? [];
      events.push(data);
      if (daySelected) {
        setDaySelected((prev: any) => {
          return {
            ...prev,
            events,
          };
        });
      }
    },
  });

  useEffect(() => {
    if (daySelected?.date) setValue("date", daySelected.date);
  }, [daySelected, setValue]);

  const formattedDate = useMemo(() => {
    if (!daySelected?.date) return "";
    const [year, month, day] = daySelected.date.split("-").map(Number);
    const date = new Date(year, month - 1, day); 
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  }, [daySelected]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="border border-gray-300 rounded-md px-4 pt-4 pb-2 mb-4 relative">
            <legend className="text-sm font-medium px-2 text-gray-700">
              Informações do Evento
            </legend>

            <div className="grid gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <Input
                  type="text"
                  placeholder="Título do evento"
                  {...register("title", { required: true })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evento
                </label>
                <Input
                  type="text"
                  placeholder="Tipo (ex: reunião, palestra...)"
                  {...register("type", { required: true })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local
                </label>
                <Input
                  type="text"
                  placeholder="Local do evento"
                  {...register("location")}
                />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  placeholder="Descrição do evento"
                  {...register("description")}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-300 rounded-md px-4 pt-4 pb-2 mb-4 relative">
            <legend className="text-sm font-medium px-2 text-gray-700">
              Horário do Evento
            </legend>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <Input
                  value={formattedDate}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Início
                </label>
                <Input
                  type="time"
                  {...register("startTime", { required: true })}
                  className="w-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Término
                </label>
                <Input
                  type="time"
                  {...register("endTime", { required: true })}
                  className="w-32"
                />
              </div>
            </div>
          </fieldset>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
