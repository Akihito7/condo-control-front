"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Paperclip } from "lucide-react";
import { ModalCreateMaintenance } from "./modal-create-maintenance";
import { useMaintenances } from "./use-maintenances";
import { format } from "date-fns";
import { MonthYearPicker } from "@/components/month-year-select";
import { Maintenance } from "@/api/fetch-maintenances";
import { ModalAttachments } from "./modal-attchaments";
import { deleteIntervention } from "@/api/delete-intervention";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ModalUpdateMaintenance } from "./modal-update-maintenance";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface MaintenancesProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

export function Maintenances({ date, setDate }: MaintenancesProps) {
  const [code, setCode] = useState("");
  const [assetSelected, setAssetSelected] = useState("-1");
  const [typeSelected, setTypeSelected] = useState("-1");
  const [statusSelected, setStatusSelected] = useState("-1");
  const [maintenanceSelected, setMaintenanceSelected] =
    useState<Maintenance | null>(null);
  const [modalAttchamentIsOpen, setModalAttchamentIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] =
    useState<number>();
  const [maintenanceSelectedToDelete, setMaintenanceSelectedToDelete] =
    useState<Maintenance | null>(null);

  const dateFormatted = format(date, "yyyy-MM-dd");

  const { priorityOptions, maintenancesStatusOptions, assets, maintenances } =
    useMaintenances({ dateFormatted });

  const getStatusName = (statusId: number) =>
    maintenancesStatusOptions?.find(
      (status) => Number(status.id) === Number(statusId),
    )?.name ?? "";

  const queryClient = useQueryClient();
  const { mutateAsync: handleDeleteIntervention } = useMutation({
    mutationFn: async (maintenanceId: number) =>
      deleteIntervention(maintenanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maintenances"],
        exact: false,
      });
    },
  });

  const filteredMaintenances =
    maintenances?.filter((maintenance) => {
      const matchesCode = code
        ? maintenance.assetsMaintenanceCode
            ?.toLowerCase()
            .includes(code.toLowerCase())
        : true;

      const matchesAsset =
        assetSelected === "-1"
          ? true
          : String(maintenance.assetsMaintenanceId) === assetSelected;

      const matchesType =
        typeSelected === "-1"
          ? true
          : String(maintenance.typeMaintenance) === typeSelected;

      const matchesStatus =
        statusSelected === "-1"
          ? true
          : String(maintenance.statusId) === statusSelected;

      return matchesCode && matchesAsset && matchesType && matchesStatus;
    }) ?? [];

  const searchParams = useSearchParams();
  useEffect(() => {
    const maintenanceId = searchParams.get("maintenanceId");
    if (!maintenanceId || !maintenances?.length) return;

    const found = maintenances.find(
      (maintenance) => maintenance.id === Number(maintenanceId),
    );
    if (!found) return;

    setMaintenanceSelected(found);
    setModalUpdateIsOpen(true);
  }, [maintenances, searchParams]);

  return (
    <div className="space-y-6">
      {/* filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end w-full">
        <div className="space-y-2">
          <Label>Selecione o mês e ano</Label>
          <MonthYearPicker
            selectedDate={date}
            onChange={setDate}
            justFutureMonths={false}
          />
        </div>

        <div className="w-[250px] space-y-2">
          <Label>Código do Ativo</Label>
          <Input
            placeholder="Ex: ELV-001"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Ativo</Label>
          <Select value={assetSelected} onValueChange={setAssetSelected}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              {assets?.map(({ id, name }) => (
                <SelectItem key={id} value={String(id)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={typeSelected} onValueChange={setTypeSelected}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              <SelectItem value="1">Preventiva</SelectItem>
              <SelectItem value="2">Corretiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={statusSelected} onValueChange={setStatusSelected}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              {maintenancesStatusOptions?.map(({ id, name }) => (
                <SelectItem key={id} value={String(id)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 📱 MOBILE */}
      <div className="md:hidden space-y-4">
        {filteredMaintenances.map((maintenance) => (
          <div key={maintenance.id} className="rounded-xl border p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  {maintenance.assetsMaintenanceCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {maintenance.typeMaintenance === "1"
                    ? "Preventiva"
                    : "Corretiva"}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setMaintenanceSelected(maintenance);
                      setModalUpdateIsOpen(true);
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setMaintenanceSelectedToDelete(maintenance)}
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Info
                label="Data"
                value={
                  maintenance.plannedStart
                    ? format(maintenance.plannedStart, "dd/MM/yyyy HH:mm")
                    : "-"
                }
              />
              <Info label="Responsável" value={maintenance.supplier} />
              <Info label="Contato" value={maintenance.contact} />
              <Info
                label="Valor"
                value={maintenance.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              />
              <Info
                label="Status"
                value={getStatusName(maintenance.statusId)}
              />
            </div>

            <Button
              variant="outline"
              className="w-full flex gap-2"
              onClick={() => {
                setMaintenanceSelected(maintenance);
                setModalAttchamentIsOpen(true);
              }}
            >
              <Paperclip className="w-4 h-4" />
              Anexos
            </Button>
          </div>
        ))}
      </div>

      {/* 📋 Tabela */}
      <section className="hidden md:block rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Manutenções</h2>

          <ModalCreateMaintenance
            priorityOptions={priorityOptions}
            maintenancesStatusOptions={maintenancesStatusOptions}
            assets={assets}
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-center">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Anexos</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredMaintenances?.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell>{maintenance.assetsMaintenanceCode}</TableCell>
                  <TableCell>
                    {maintenance.typeMaintenance === "1"
                      ? "Preventiva"
                      : "Corretiva"}
                  </TableCell>
                  <TableCell>
                    {maintenance.plannedStart
                      ? format(maintenance.plannedStart, "dd/MM/yyyy HH:mm")
                      : ""}
                  </TableCell>
                  <TableCell>{maintenance.supplier}</TableCell>
                  <TableCell>{maintenance.contact}</TableCell>
                  <TableCell className="text-center">
                    {maintenance.amount.toLocaleString("pt-BR", {
                      currency: "BRL",
                      style: "currency",
                    })}
                  </TableCell>
                  <TableCell>{getStatusName(maintenance.statusId)}</TableCell>
                  <TableCell
                    onClick={() => {
                      setMaintenanceSelected(maintenance);
                      setModalAttchamentIsOpen(true);
                    }}
                  >
                    <div className="cursor-pointer flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition w-12 h-12">
                      <Paperclip className="w-4 h-4 text-gray-700" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu
                      open={
                        dropdownOpen &&
                        dropdownOpenToThisItem === maintenance.id
                      }
                      onOpenChange={(open) => {
                        if (!open) {
                          setDropdownOpenToThisItem(undefined);
                        } else {
                          setDropdownOpenToThisItem(maintenance.id);
                        }
                        setDropdownOpen(open);
                      }}
                    >
                      <DropdownMenuTrigger className="outline-none">
                        <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setDropdownOpen(false);
                            setMaintenanceSelected(maintenance);
                            setModalUpdateIsOpen(true);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDropdownOpen(false);
                            setMaintenanceSelectedToDelete(maintenance);
                          }}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* modais */}
      <ModalAttachments
        isOpen={modalAttchamentIsOpen}
        setIsOpen={setModalAttchamentIsOpen}
        maintenanceSelected={maintenanceSelected}
        setMaintenanceSelected={setMaintenanceSelected}
      />

      <ModalUpdateMaintenance
        assets={assets}
        maintenance={maintenanceSelected}
        maintenancesStatusOptions={maintenancesStatusOptions}
        priorityOptions={priorityOptions}
        setMaintenance={setMaintenanceSelected}
        isOpen={modalUpdateIsOpen}
        setIsOpen={setModalUpdateIsOpen}
      />

      <Dialog
        open={!!maintenanceSelectedToDelete}
        onOpenChange={() => setMaintenanceSelectedToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta manutenção?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMaintenanceSelectedToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!maintenanceSelectedToDelete) return;
                await handleDeleteIntervention(maintenanceSelectedToDelete.id);
                setMaintenanceSelectedToDelete(null);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
