"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Tag, CalendarClock, Clock, MapPin } from "lucide-react";
import React, { SetStateAction } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

interface EventDetailsModalProps {
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<SetStateAction<boolean>>;
}
export function EventDetailsModal({
  isOpen,
  setModalIsOpen,
}: EventDetailsModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setModalIsOpen(open);
      }}
    >
      <DialogContent className="max-w-md rounded-2xl border border-gray-200 shadow-xl">
        <DialogHeader className="relative pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <Info className="text-blue-500 mt-1" />
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Reunião de Condomínio
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Detalhes do evento
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3">
            <Tag className="text-gray-400 mt-1" size={18} />
            <div className="text-sm">
              <span className="font-medium text-gray-700">Tipo:</span>{" "}
              <span className="text-gray-800">Reunião</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Info className="text-gray-400 mt-1" size={18} />
            <div className="text-sm">
              <span className="font-medium text-gray-700">Descrição:</span>{" "}
              <span className="text-gray-800">Pauta: Orçamento 2025</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarClock className="text-gray-400 mt-1" size={18} />
            <div className="text-sm">
              <span className="font-medium text-gray-700">Início:</span>{" "}
              <span className="text-gray-800">15/07/2025 às 19:00</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="text-gray-400 mt-1" size={18} />
            <div className="text-sm">
              <span className="font-medium text-gray-700">Fim:</span>{" "}
              <span className="text-gray-800">15/07/2025 às 21:00</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 mt-1" size={18} />
            <div className="text-sm">
              <span className="font-medium text-gray-700">Local:</span>{" "}
              <span className="text-gray-800">Salão de Festas</span>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
