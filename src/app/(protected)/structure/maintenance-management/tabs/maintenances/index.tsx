"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Paperclip, Router } from "lucide-react";
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
import { useRouter, useSearchParams } from "next/navigation";

export function Maintenances() {
  const [code, setCode] = useState<string>("");
  const [assetSelected, setAssetSelected] = useState<string>("-1");
  const [typeSelected, setTypeSelected] = useState<string>("-1");
  const [statusSelected, setStatusSelected] = useState<string>("-1");
  const [maintenanceSelected, setMaintenanceSelected] =
    useState<Maintenance | null>(null);
  const [modalAttchamentIsOpen, setModalAttchamentIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] = useState<
    number | undefined
  >();
  const [maintenanceSelectedToDelete, setMaintenanceSelectedToDelete] =
    useState<Maintenance | null>(null);

  const {
    priorityOptions,
    priorityOptionsStatus,
    maintenancesStatusOptions,
    maintenancesStatusOptionsStatus,
    assets,
    assetsStatus,
    maintenances,
    maintenancesStatus,
    date,
    setDate,
  } = useMaintenances();

  const getStatusName = (statusId: number) => {
    const status = maintenancesStatusOptions?.find(
      (status) => Number(status.id) === Number(statusId)
    );

    return status?.name ?? "";
  };

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

  const filteredMaintenances = maintenances?.filter((maintenance) => {
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
  });

  const getMaintenanceById = (id: number) => {
    const maintenance = maintenances?.find(
      (maintenance) => maintenance.id === id
    );

    return maintenance;
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const maintenanceId = searchParams.get("maintenanceId");
    const dateFormatted = searchParams.get("date");

    if (!maintenanceId || !dateFormatted) return;

    const date = new Date(dateFormatted);
    setDate(date);

    if (!maintenances || maintenances.length === 0) return;

    const maintenanceSelected = getMaintenanceById(Number(maintenanceId));

    if (!maintenanceSelected) return;
    setMaintenanceSelected(maintenanceSelected);
    setModalUpdateIsOpen(true);
  }, [maintenances, searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
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
            onChange={(event) => setCode(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Ativo</Label>
          <Select
            value={assetSelected}
            onValueChange={(value) => setAssetSelected(value)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Selecione o ativo" />
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
          <Select
            value={typeSelected}
            onValueChange={(value) => setTypeSelected(value)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Selecione o tipo" />
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
          <Select
            value={statusSelected}
            onValueChange={(value) => setStatusSelected(value)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Selecione o status" />
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

      {/* 📋 Tabela */}
      <section className="rounded-xl overflow-auto border">
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
                      ? format(maintenance.plannedStart, "yyyy/MM/dd HH:mm")
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

      {/* 📎 Modal de anexos */}
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
        onOpenChange={(open) => {
          if (!open) setMaintenanceSelectedToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a manutenção no ativo{" "}
              <strong>
                {maintenanceSelectedToDelete?.assetsMaintenanceName}
              </strong>{" "}
              <br />
              {maintenanceSelectedToDelete?.plannedStart
                ? "para a data " +
                  format(
                    maintenanceSelectedToDelete.plannedStart,
                    "yyyy/MM/dd HH:mm"
                  ) +
                  "?"
                : ""}
              <br />
              Esta ação não poderá ser desfeita.
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
                if (!maintenanceSelected) return;
                await handleDeleteIntervention(maintenanceSelected.id);
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
