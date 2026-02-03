"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import React, { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useUnitWorks } from "./use-unit-works";
import { Button } from "@/components/ui/button";
import { FileDown, MoreHorizontal, Paperclip } from "lucide-react";
import { ModalActionMaintenance } from "./modal-action-maintenance";
import { ModalAttchament } from "@/components/attachments/modal-attachament";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommandDelete } from "@/commands/use-command.delete";
import { useQueryClient } from "@tanstack/react-query";
import { WorkUnit } from "@/api/fetch-unit-works";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<number, string> = {
  1: "bg-slate-200 text-slate-700", // EM ESPERA
  2: "bg-amber-400 text-amber-950", // EM ANDAMENTO
  3: "bg-red-500 text-white", // PARALISADA
  4: "bg-green-400 text-white", // FINALIZADA
};

// Helper apenas para o Mobile
function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
    </div>
  );
}

export default function UnitWorks() {
  const { startDate, setStartDate, unitWorksStatuses, apartaments, unitWorks } =
    useUnitWorks();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [dropDownItemSelected, setDropDownItemSelected] = useState<
    number | null
  >(null);
  const [workSelected, setWorkSelected] = useState<WorkUnit | undefined>(
    undefined,
  );

  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileDropdownItem, setMobileDropdownItem] = useState<
    number | undefined
  >();

  const queryClient = useQueryClient();

  function onDeleteSuccess() {
    queryClient.invalidateQueries({ exact: false, queryKey: ["works"] });
  }

  const { execute: handleDeleteRegister } = useCommandDelete({
    onSuccess: onDeleteSuccess,
  });
  const [apartmentFilter, setApartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("-1");

  const filteredUnitWorks = useMemo(() => {
    return (
      unitWorks?.filter((work) => {
        if (Number(statusFilter) > 0 && work.statusId !== Number(statusFilter))
          return false;
        if (apartmentFilter) {
          const apt = apartaments?.find((a) => a.id === work.apartamentId);
          if (
            !apt ||
            !apt.apartmentNumber?.toString().includes(apartmentFilter)
          )
            return false;
        }
        return true;
      }) ?? []
    );
  }, [unitWorks, statusFilter, apartmentFilter, startDate, apartaments]);

  return (
    // Mantido o overflow-x-auto original do seu código
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-x-auto">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Obras nas unidades
        </h1>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:items-end md:flex-row">
          <div className="w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartamentos
            </label>
            <Input
              placeholder="21"
              style={{ height: 39 }}
              value={apartmentFilter}
              onChange={(e) => setApartmentFilter(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Todos</SelectItem>
                {unitWorksStatuses?.map((status: any) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
          >
            <FileDown className="w-6 h-6" />
            Exportar PDF
          </Button>
        </div>

        <section className="rounded-xl overflow-auto border">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800 text-lg">Obras</h2>
            <ModalActionMaintenance
              statusOptions={unitWorksStatuses}
              apartments={apartaments}
              isOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              work={workSelected}
              setWork={setWorkSelected}
            >
              <Button variant="outline">Nova Solicitação</Button>
            </ModalActionMaintenance>
          </div>

          {/* 📱 MOBILE VIEW - Cards sem trava de scroll interno */}
          <div className="md:hidden p-4 space-y-4">
            {filteredUnitWorks.map((work) => (
              <div
                key={work.id}
                className="rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">
                      Unidade:{" "}
                      {
                        apartaments?.find((apt) => apt.id === work.apartamentId)
                          ?.apartmentNumber
                      }
                    </p>
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 text-[10px] font-bold rounded uppercase",
                        STATUS_BADGE[work.statusId],
                      )}
                    >
                      {
                        unitWorksStatuses?.find(
                          (s: any) => s.id === work.statusId,
                        )?.name
                      }
                    </span>
                  </div>
                  <DropdownMenu
                    open={mobileDropdownOpen && mobileDropdownItem === work.id}
                    onOpenChange={(open) => {
                      setMobileDropdownItem(work.id);
                      setMobileDropdownOpen(open);
                    }}
                  >
                    <DropdownMenuTrigger className="outline-none">
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setModalIsOpen(true);
                          setWorkSelected(work);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          handleDeleteRegister({
                            registerId: work.id,
                            tableName: "works_units",
                          })
                        }
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-y-4 pt-2 border-t">
                  <InfoField
                    label="Início"
                    value={new Date(
                      `${work.forecastDate}T12:00:00`,
                    ).toLocaleDateString("pt-BR")}
                  />
                  <InfoField
                    label="Fim"
                    value={new Date(
                      `${work.forecastEndDate}T12:00:00`,
                    ).toLocaleDateString("pt-BR")}
                  />
                  <div className="col-span-2">
                    <InfoField label="Descrição" value={work.description} />
                  </div>
                  <InfoField
                    label="ART"
                    value={work.hasArtRrt ? "Sim" : "Não"}
                  />
                  <InfoField label="Observações" value={work.observations} />
                </div>
                <div className="pt-2 border-t flex justify-center">
                  <ModalAttchament relatedId={work.id} relatedType="unit-works">
                    <Button variant="ghost" className="w-full gap-2">
                      <Paperclip className="w-4 h-4" /> Ver Anexos
                    </Button>
                  </ModalAttchament>
                </div>
              </div>
            ))}
          </div>

          {/* 📋 DESKTOP VIEW - Restaurada exatamente como o original */}
          <div className="hidden md:block">
            <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
              <Table className="min-w-full border-collapse">
                <TableHeader className="sticky top-0 bg-white shadow-md z-10">
                  <TableRow>
                    <TableHead>Previsão Inicio</TableHead>
                    <TableHead>Previsão Fim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>ART</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="text-center">Anexos</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnitWorks.length > 0 ? (
                    filteredUnitWorks.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell>
                          {new Date(
                            `${work.forecastDate}T12:00:00`,
                          ).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            `${work.forecastEndDate}T12:00:00`,
                          ).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-md",
                              STATUS_BADGE[work.statusId],
                            )}
                          >
                            {unitWorksStatuses?.find(
                              (status: any) => status.id === work.statusId,
                            )?.name ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {apartaments?.find(
                            (apt) => apt.id === work.apartamentId,
                          )?.apartmentNumber ?? "-"}
                        </TableCell>
                        <TableCell>{work.description}</TableCell>
                        <TableCell>{work.hasArtRrt ? "Sim" : "Não"}</TableCell>
                        <TableCell>{work.observations}</TableCell>
                        <TableCell className="text-center">
                          <ModalAttchament
                            relatedId={work.id}
                            relatedType="unit-works"
                          >
                            <Button variant="ghost">
                              <Paperclip className="w-5 h-5" />
                            </Button>
                          </ModalAttchament>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu
                            open={
                              dropDownIsOpen && dropDownItemSelected === work.id
                            }
                            onOpenChange={(open) => {
                              setDropDownItemSelected(work.id);
                              setDropDownIsOpen(open);
                            }}
                          >
                            <DropdownMenuTrigger className="outline-none">
                              <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDropDownIsOpen(false);
                                  setDropDownItemSelected(null);
                                  setModalIsOpen(true);
                                  setWorkSelected(work);
                                }}
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => {
                                  handleDeleteRegister({
                                    registerId: work.id,
                                    tableName: "works_units",
                                  });
                                }}
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-4 text-gray-500"
                      >
                        Nenhuma obra encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
