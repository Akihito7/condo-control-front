"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import {
  AssetMaintenanceReport,
  getAsssetMaintenanacesDetails,
} from "@/api/get-asset-maintenances-details";
import { Calendar, CheckCircle2, ClipboardList, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, subHours } from "date-fns";

interface ModalViewAssetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  assetSelected: AssetMaintenanceReport | null;
}

export function ModalViewAsset({
  isOpen,
  setIsOpen,
  assetSelected,
}: ModalViewAssetProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Detalhes do Ativo
          </DialogTitle>
          <DialogDescription>
            Informações técnicas e histórico de manutenções realizadas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          {/* Cabeçalho do Ativo */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-foreground">
              {assetSelected?.name || "Nome não encontrado"}
            </h3>
            <p className="text-sm text-muted-foreground">
              ID do Ativo: #{assetSelected?.asset_id}
            </p>
            <div className="mt-3 flex gap-4">
              <div className="flex flex-col">
                <span className="text-xs uppercase text-muted-foreground font-medium">
                  Total de Manutenções
                </span>
                <span className="text-xl font-bold">
                  {assetSelected?.total_maintenances}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lista de Manutenções */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Histórico de Manutenções
            </h4>

            {assetSelected?.maintenances &&
            assetSelected.maintenances.length > 0 ? (
              <div className="grid gap-3">
                {assetSelected.maintenances.map((m, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {m.carriedOutDate
                          ? new Date(m.carriedOutDate).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : ""}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-3 h-3" />
                        {m.carriedOutDate
                          ? format(
                              new Date(m.carriedOutDate),
                              "dd/MM/yyyy, HH:mm",
                            )
                          : ""}
                      </div>
                    </div>

                    <Badge className="bg-gray-200 text-black">
                      {m.statusName}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed rounded-md text-muted-foreground">
                Nenhuma manutenção registrada para este ativo.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
