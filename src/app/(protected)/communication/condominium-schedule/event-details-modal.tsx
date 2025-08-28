"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Event } from "@/api/fetch-condominium-schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { updateEventCondominium } from "@/api/update-event-condominium";
import { deleteEventCondominium } from "@/api/delete-event-condominium";

interface EventDetailsModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  eventSelected: Event | undefined;
  setEventSelected: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

interface EventFormValues {
  id: number;
  title: string;
  type: string | null;
  location: string;
  startTime: string;
  endTime: string;
  date: string;
  description: string | null;
}

export function EventDetailsModal({
  isOpen,
  setIsOpen,
  eventSelected,
  setEventSelected,
}: EventDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  function invalidQueries() {
    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["condominium-schedule"],
    });
  }

  const { register, handleSubmit, reset, setValue, getValues } =
    useForm<EventFormValues>();

  // mutation de update
  const { mutateAsync: handleUpdateEvent, isPending } = useMutation({
    mutationFn: (data: EventFormValues) => updateEventCondominium(data),
    onSuccess: () => {
      setIsEditing(false);
      invalidQueries();
    },
  });

  // mutation de delete
  const { mutateAsync: handleDeleteEventCondominium } = useMutation({
    mutationFn: () => deleteEventCondominium(eventSelected!.id),
    onSuccess: () => {
      setEventSelected(undefined);
      setIsOpen(false);
      invalidQueries();
    },
  });

  // quando abrir o modal, preenche os valores no form
  useEffect(() => {
    if (eventSelected) {
      const dateFormatted = format(
        new Date(eventSelected.startTime),
        "yyyy-MM-dd"
      );

      const formattedStart = format(new Date(eventSelected.startTime), "HH:mm");
      const formattedEnd = format(new Date(eventSelected.endTime), "HH:mm");

      reset({
        id: eventSelected.id,
        title: eventSelected.title,
        type: eventSelected.type,
        location: eventSelected.area,
        startTime: formattedStart,
        endTime: formattedEnd,
        date: dateFormatted,
        description: eventSelected.description,
      });
    }
  }, [eventSelected, reset]);

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    await handleUpdateEvent(data);
  };

  // Helpers de formatação
  const formatDate = (date: string | Date) =>
    format(new Date(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const formatTime = (date: string | Date) => format(new Date(date), "HH:mm");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false);
          setEventSelected(undefined);
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Evento" : eventSelected?.title}
          </DialogTitle>
          {!isEditing && (
            <DialogDescription>{eventSelected?.description}</DialogDescription>
          )}
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Informações do Evento */}
            <fieldset className="border border-gray-300 rounded-md px-4 pt-4 pb-2 mb-4 relative">
              <legend className="text-sm font-medium px-2 text-gray-700">
                Informações do Evento
              </legend>

              <div className="grid gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <Input
                    type="text"
                    {...register("title", { required: true })}
                    className="border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tipo de Evento
                  </label>
                  <Input
                    type="text"
                    {...register("type", { required: true })}
                    className="border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Local
                  </label>
                  <Input
                    type="text"
                    {...register("location")}
                    className="border-gray-300 focus-visible:ring-2
                  focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </fieldset>

            {/* Horário do Evento */}
            <fieldset className="border border-gray-300 rounded-md px-4 pt-4 pb-2 mb-4 relative">
              <legend className="text-sm font-medium px-2 text-gray-700">
                Horário do Evento
              </legend>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <Input
                    value={formatDate(getValues("date"))}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Início
                  </label>
                  <Input
                    type="time"
                    {...register("startTime", { required: true })}
                    className="border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Término
                  </label>
                  <Input
                    type="time"
                    {...register("endTime", { required: true })}
                    className="border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>
              </div>
            </fieldset>

            <DialogFooter className="mt-4 flex justify-between">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-3 py-4">
            <p>
              <span className="font-medium">Tipo:</span> {eventSelected?.type}
            </p>
            <p>
              <span className="font-medium">Local:</span> {eventSelected?.area}
            </p>
            <p>
              <span className="font-medium">Início:</span>{" "}
              {eventSelected && formatTime(eventSelected.startTime)}
            </p>
            <p>
              <span className="font-medium">Fim:</span>{" "}
              {eventSelected && formatTime(eventSelected.endTime)}
            </p>
            <p>
              <span className="font-medium">Data:</span>{" "}
              {eventSelected && formatDate(eventSelected.startTime)}
            </p>

            <DialogFooter className="pt-4 flex justify-between">
              <div className="flex justify-between w-full">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEventCondominium()}
                >
                  Deletar
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                  <DialogClose asChild>
                    <Button>Fechar</Button>
                  </DialogClose>
                </div>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
