"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DatePickerWithHours } from "@/components/date-picker-with-hours";

export function AddEventModal() {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Adicionar Evento
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Evento</DialogTitle>
        </DialogHeader>

        <fieldset className="border border-gray-300 rounded-md px-4 pt-4 pb-2 mb-4 relative">
          <legend className="text-sm font-medium px-2 text-gray-700">
            Informações do Evento
          </legend>

          <div className="grid gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <Input type="text" placeholder="Título do evento" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento
              </label>
              <Input
                type="text"
                placeholder="Tipo (ex: reunião, palestra...)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local
              </label>
              <Input type="text" placeholder="Local do evento" />
            </div>
          </div>
        </fieldset>

  
        <fieldset className="border border-gray-300 rounded-md px-4 pt-4 pb-2 mb-4 relative ">
          <legend className="text-sm font-medium px-2 text-gray-700">
            Horário do Evento
          </legend>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Início
              </label>
              <DatePickerWithHours date={startDate} setDate={setStartDate} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Término
              </label>
              <DatePickerWithHours date={startDate} setDate={setStartDate} />
            </div>
          </div>
        </fieldset>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
