"use client";
import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePickRange } from "@/components/date-pick-ranger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDown, MoreHorizontal, Paperclip } from "lucide-react";
import { useResidentRequests } from "./use-resident-requests";
import { ModalActionResident } from "./modal-action-resident";
import { useCommandDelete } from "@/commands/use-command.delete";
import { ModalAttchament } from "@/components/attachments/modal-attachament";
import { format } from "date-fns";
import { Option } from "@/api/fetch-work-areas";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<number, string> = {
  1: "bg-slate-200 text-slate-700", // PENDENTE
  2: "bg-amber-400 text-amber-950", // EM ANDAMENTO
  3: "bg-green-400 text-white", // RESOLVIDO
};

export default function ResidentRequests() {
  const {
    range,
    setRange,
    apartaments,
    modalIsOpen,
    requestSelected,
    setModalIsOpen,
    gravities,
    status,
    setRequestSelected,
    residentCalls,
    apartamentIdSelected,
    setApartamentIdSelected,
    setStatusIdSelected,
    statusIdSelected,
  } = useResidentRequests();

  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [dropDownItemSelected, setDropDownItemSelected] = useState<
    number | null
  >(null);

  const queryClient = useQueryClient();
  function onDeleteSuccess() {
    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["resident-calls"],
    });
  }
  const { execute: handleDeleteRegister } = useCommandDelete({
    onSuccess: onDeleteSuccess,
  });

  function getOptionName(
    optionSelected: string | number,
    options: Option[] = [],
  ) {
    const optionFound = options.find(
      (option) => option.id.toString() === optionSelected.toString(),
    );

    return optionFound?.name ?? "-";
  }

  const callsFiltered = residentCalls?.filter((call: any) => {
    if (!apartamentIdSelected && !statusIdSelected) return true;

    const apartamentIdMatch =
      Number(apartamentIdSelected) > 0
        ? apartamentIdSelected.toString() === call.apartamentId.toString()
        : true;

    const statusIdMatch =
      Number(statusIdSelected) > 0
        ? statusIdSelected.toString() === call.statusId.toString()
        : true;

    return apartamentIdMatch && statusIdMatch;
  });

  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-x-auto">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Comunicação"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Chamados de Moradores
        </h1>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:items-end md:flex-row">
          <div className="w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periodo
            </label>
            <DatePickRange setRange={setRange} range={range} className="h-9" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={statusIdSelected}
              onValueChange={setStatusIdSelected}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Selecione o tipo de problema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Todos</SelectItem>
                {status?.map(({ name, id }: any) => (
                  <SelectItem key={id} value={id.toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apartamento
            </label>
            <Select
              value={apartamentIdSelected}
              onValueChange={setApartamentIdSelected}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Apartamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Todos</SelectItem>
                {apartaments?.map((apartament) => (
                  <SelectItem
                    key={apartament.id}
                    value={apartament.id.toString()}
                  >
                    {apartament.apartmentNumber}
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
            <h2 className="font-medium text-gray-800 text-lg">Chamados</h2>

            <ModalActionResident
              apartments={apartaments}
              isOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              gravityOptions={gravities}
              statusOptions={status}
              requestSelected={requestSelected}
              setRequestSelected={setRequestSelected}
              type={requestSelected ? "edit" : "create"}
            />
          </div>

          <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
            <Table className="min-w-full border-collapse">
              <TableHeader className="sticky top-0 bg-white shadow-md z-10">
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Apartamento</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Gravidade</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-center">Início Atuação</TableHead>
                  <TableHead className="text-left">Fim Atuação</TableHead>
                  <TableHead className="text-left">Anexos</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callsFiltered?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-4 text-gray-500"
                    >
                      No interventions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  callsFiltered?.map((call: any) => (
                    <TableRow key={call.id}>
                      {/* Data */}
                      <TableCell>
                        {format(call.createdAt, "dd/MM/yyyy")}
                      </TableCell>

                      {/* Apartamento */}
                      <TableCell>
                        {getOptionName(
                          call.apartamentId,
                          apartaments?.map((ap) => ({
                            name: ap.apartmentNumber,
                            id: ap.id,
                          })),
                        )}
                      </TableCell>

                      {/* Descrição */}
                      <TableCell className="max-w-[250px] truncate">
                        {call.description}
                      </TableCell>

                      {/* Gravidade */}
                      <TableCell>
                        {getOptionName(call.gravityId, gravities)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-md",
                            STATUS_BADGE[call.statusId],
                          )}
                        >
                          {getOptionName(call.statusId, status)}
                        </span>
                      </TableCell>

                      {/* Início Atuação */}
                      <TableCell className="text-center">
                        {call.startDate
                          ? format(call.startDate, "dd/MM/yyyy hh:mm")
                          : "-"}
                      </TableCell>

                      {/* Fim Atuação */}
                      <TableCell>
                        {call.endDate
                          ? format(call.endDate, "dd/MM/yyyy hh:mm")
                          : "-"}
                      </TableCell>

                      {/* Anexos */}
                      <TableCell className="text-center">
                        <ModalAttchament
                          relatedId={call.id}
                          relatedType="resident_calls"
                        >
                          <Button variant="ghost">
                            <Paperclip className="w-5 h-5" />
                          </Button>
                        </ModalAttchament>
                      </TableCell>

                      {/* Ações */}
                      <TableCell className="text-center">
                        <DropdownMenu
                          open={
                            dropDownIsOpen && dropDownItemSelected === call.id
                          }
                          onOpenChange={(open) => {
                            setDropDownItemSelected(call.id);
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
                                setRequestSelected(call);
                              }}
                            >
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                handleDeleteRegister({
                                  registerId: call.id,
                                  tableName: "resident_calls",
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
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
