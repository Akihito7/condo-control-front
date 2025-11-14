import { DayEvent } from "@/api/fetch-calendar-maintenances";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User, Wrench, Clock, Tag } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MaintenanceStatusOption } from "@/api/fetch-maintenances-status";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

interface ModalViewMaintenanceProps {
  event: DayEvent | null;
  setEventSelected: React.Dispatch<React.SetStateAction<DayEvent | null>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  statusMaintenances: MaintenanceStatusOption[] | undefined;
  setTabSelected: Dispatch<SetStateAction<string>>;
}

export function ModalViewMaintenance({
  event,
  setEventSelected,
  isOpen,
  setIsOpen,
  statusMaintenances,
  setTabSelected,
}: ModalViewMaintenanceProps) {
  const [navigate, setNavigate] = useState(false);
  const getStatusName = (statusId?: number) => {
    if (!statusId) return "";
    const status = statusMaintenances?.find((status) => status.id === statusId);
    return status?.name ?? "";
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  function handleNavigate() {
    const dateFormatted = event?.plannedStart
      ? format(new Date(event!.plannedStart), "yyyy-MM-dd")
      : "";
    const maintenanceId = event?.id;

    if (!dateFormatted || !maintenanceId) return;
    router.replace(
      `maintenance-management?tab=maintenances&date=${dateFormatted}&maintenanceId=${maintenanceId}`
    );
    setNavigate(true);
  }

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab === "maintenances" && navigate) {
      setTabSelected("maintenances");
    }
  }, [navigate, searchParams]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setEventSelected(null);
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Wrench className="w-5 h-5 text-blue-600" />
            Detalhes da Manutenção
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a manutenção selecionada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3 text-sm">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <p>
              <span className="font-medium text-gray-700">Ativo:</span>{" "}
              {event?.assetsMaintenance?.code} -{" "}
              {event?.assetsMaintenance?.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p>
              <span className="font-medium text-gray-700">Data:</span>{" "}
              {event?.plannedStart
                ? new Date(event?.plannedStart).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-500" />
            <p>
              <span className="font-medium text-gray-700">Tipo:</span>{" "}
              {event?.typeMaintenance === "1" ? "Preventiva" : "Corretiva"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <p>
              <span className="font-medium text-gray-700">Responsável:</span>{" "}
              {event?.supplier || "Não informado"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <p className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Status:</span>
              <Badge variant="outline">{getStatusName(event?.statusId)}</Badge>
            </p>
          </div>
        </div>

        <Separator className="my-2" />

        <DialogFooter className="flex justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button variant="default" onClick={handleNavigate}>
            Ir para Edição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
