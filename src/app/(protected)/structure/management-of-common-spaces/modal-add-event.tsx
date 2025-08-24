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
import { CalendarIcon, DollarSign } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { CondominiumArea } from "@/api/get-management-commom-spaces";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DayWithEvents } from "@/api/fetch-events-by-condominium-area";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpaceEvent } from "@/api/create-space-event";
import { Apartment } from "@/api/fetch-apartaments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserContext } from "@/providers/use-user-context";

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
}

type FormValues = {
  eventDate: Date;
  apartmentId: string;
  condominiumAreaId: string;
  timeBlocks: string[];
  startTime: string;
  endTime: string;
};

const generateTimeBlocks = () => {
  const blocks: string[] = [];
  for (let hour = 0; hour <= 23; hour++) {
    blocks.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return blocks;
};

export function ModalAddEvent({
  open,
  setIsOpen,
  condominiumAreaId,
  spacesCommom,
  dayWithEventSelected,
  setDayWithEventSelected,
  apartaments,
}: ModalAddEventProps) {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const timeBlocks = generateTimeBlocks();
  const { user } = useUserContext();
  const isResident = !!user.userAssociationApartmentId;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      eventDate: new Date(),
      condominiumAreaId: condominiumAreaId,
      apartmentId: "3",
      timeBlocks: [],
      startTime: "",
      endTime: "",
    },
  });

  const currentCondominiumArea = spacesCommom?.find(
    (space) => String(space.id) === condominiumAreaId
  );

  const events = dayWithEventSelected?.events || [];

  const date = dayWithEventSelected?.date
    ? (() => {
        const [year, month, day] = dayWithEventSelected.date.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
      })()
    : null;

  const blockedBlocks = React.useMemo(() => {
    const blocked: Set<string> = new Set();
    events.forEach((event) => {
      const startHour = parseInt(event.startTime.split(":")[0], 10);
      const endHour = parseInt(event.endTime.split(":")[0], 10);
      for (let hour = startHour; hour < endHour; hour++) {
        blocked.add(`${hour.toString().padStart(2, "0")}:00`);
      }
    });
    return Array.from(blocked);
  }, [events]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setSelectedBlocks([]);
    setDayWithEventSelected(undefined);
  };

  const handleBlockClick = (block: string) => {
    if (blockedBlocks.includes(block)) return;

    let updated: string[] = [];

    if (selectedBlocks.includes(block)) {
      updated = selectedBlocks.filter((b) => b !== block);
    } else {
      updated = [...selectedBlocks, block].sort();
    }

    const blockIndexes = updated.map((b) => timeBlocks.indexOf(b));
    const isConsecutive = blockIndexes.every(
      (val, i, arr) => i === 0 || val === arr[i - 1] + 1
    );

    if (isConsecutive) {
      setSelectedBlocks(updated);
      setValue("timeBlocks", updated);

      // Calcula o startTime e endTime
      const firstBlock = updated[0];
      const lastBlock = updated[updated.length - 1];
      const lastIndex = timeBlocks.indexOf(lastBlock);

      const endTime = timeBlocks[lastIndex + 1] || "23:59"; // fallback para último horário

      setValue("startTime", firstBlock);
      setValue("endTime", endTime);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const dataToSend = {
      ...data,
      eventDate: dayWithEventSelected?.date,
    };
    await handleCreateSpaceEvent(dataToSend);
    handleClose();
  };

  const queryClient = useQueryClient();
  const { mutateAsync: handleCreateSpaceEvent } = useMutation({
    mutationFn: async (data: any) => createSpaceEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
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
    });
  }, [user, condominiumAreaId]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md">
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
              <p className="text-sm text-gray-500">Valor por Hora</p>
              <p className="text-lg font-semibold text-gray-800">
                R$ {Number(currentCondominiumArea?.hourly_rent).toFixed(2)}
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
                      {apartaments?.map((apartament) => (
                        <SelectItem value={String(apartament.id)}>
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

          <DialogFooter className="pt-4 flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary" type="button" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || selectedBlocks.length === 0}
            >
              Salvar Evento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
