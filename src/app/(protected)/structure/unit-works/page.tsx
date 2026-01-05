"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useMemo, useState } from "react";
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
import { DatePickRange } from "@/components/date-pick-ranger";
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

export default function UnitWorks() {
  const { range, setRange, unitWorksStatuses, apartaments, unitWorks } =
    useUnitWorks();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [dropDownItemSelected, setDropDownItemSelected] = useState<
    number | null
  >(null);
  const [workSelected, setWorkSelected] = useState<WorkUnit | undefined>(
    undefined
  );

  const queryClient = useQueryClient();

  function onDeleteSuccess() {
    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["works"],
    });
  }
  const { execute: handleDeleteRegister } = useCommandDelete({
    onSuccess: onDeleteSuccess,
  });
  const [apartmentFilter, setApartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredUnitWorks = useMemo(() => {
    return (
      unitWorks?.filter((work) => {
        if (statusFilter && work.statusId !== Number(statusFilter)) {
          return false;
        }

        if (apartmentFilter) {
          const apt = apartaments?.find((a) => a.id === work.apartamentId);
          if (
            !apt ||
            !apt.apartmentNumber?.toString().includes(apartmentFilter)
          ) {
            return false;
          }
        }

        if (range?.from && range?.to) {
          const forecast = new Date(work.forecastDate);
          const from = new Date(range.from);
          const to = new Date(range.to);
          to.setHours(23, 59, 59, 999);

          if (forecast < from || forecast > to) {
            return false;
          }
        }

        return true;
      }) ?? []
    );
  }, [unitWorks, statusFilter, apartmentFilter, range, apartaments]);

  return (
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
              Previsão
            </label>
            <DatePickRange setRange={setRange} range={range} className="h-9" />
          </div>

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

            <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
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

          <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
            <Table className="min-w-full border-collapse">
              <TableHeader className="sticky top-0 bg-white shadow-md z-10">
                <TableRow>
                  <TableHead>Previsão</TableHead>
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
                        {new Date(work.forecastDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>

                      <TableCell>
                        {unitWorksStatuses?.find(
                          (status: any) => status.id === work.statusId
                        )?.name ?? "-"}
                      </TableCell>

                      <TableCell>
                        {apartaments?.find(
                          (apt) => apt.id === work.apartamentId
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
                              <span>Editar</span>
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
                      colSpan={8}
                      className="text-center py-4 text-gray-500"
                    >
                      Nenhuma obra encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
