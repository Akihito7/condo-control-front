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
import { DatePickRange } from "@/components/date-pick-ranger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useUnits } from "./use-units";
import { ModalActionUnits } from "./modal-action-units";
import { Option } from "@/api/fetch-work-areas";

export default function Units() {
  const {
    range,
    setRange,
    modalIsOpen,
    setModalIsOpen,
    apartaments,
    statuses,
    units,
    blocks,
    search,
    setSearch,
    setStatusIdSelected,
    statusIdSelected,
  } = useUnits();

  function getOption(optionId: number | string, options: Option[]) {
    const foundOption = options?.find(
      (option) => option.id.toString() === optionId.toString()
    );

    return foundOption?.name ?? "-";
  }

  const filteredUnits = units?.filter((unit: any) => {
    if (!search && !statusIdSelected) return true;

    const apartamentOptions =
      apartaments?.map(({ apartmentNumber, id }) => ({
        name: apartmentNumber,
        id,
      })) ?? [];

    const apartamentNumber = getOption(unit.apartamentId, apartamentOptions);

    apartaments?.map(({ apartmentNumber, id }) => ({
      name: apartmentNumber,
      id,
    }));
    const searchApartmentMatch = apartamentNumber
      .toString()
      .toLowerCase()
      .includes(search.toString().toLowerCase());

    const searchGuest = unit.guest
      .toString()
      .toLowerCase()
      .includes(search.toString().toLowerCase());

    const statusMatch = statusIdSelected
      ? statusIdSelected === unit.statusId.toString()
      : true;

    return statusMatch && (searchApartmentMatch || searchGuest);
  });

  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Segurança"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Unidades</h1>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:items-end md:flex-row">
          <div className="w-[350px] space-y-2">
            <Label>Apartamento/Morador</Label>
            <Input
              placeholder="Busque por apartamento ou morador"
              style={{ height: 39 }}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={statusIdSelected}
              onValueChange={setStatusIdSelected}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Selecione o tipo de problema" />
              </SelectTrigger>
              <SelectContent>
                {statuses?.map((status: any) => (
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
            <h2 className="font-medium text-gray-800 text-lg">Unidades</h2>

            <ModalActionUnits
              isOpen={modalIsOpen}
              setIsOpen={setModalIsOpen}
              type="create"
              status={statuses}
              apartaments={apartaments?.map(({ apartmentNumber, id }) => ({
                name: apartmentNumber,
                id,
              }))}
            />
          </div>

          <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
            <Table className="min-w-full border-collapse">
              <TableHeader className="sticky top-0 bg-white shadow-md z-10">
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Bloco</TableHead>
                  <TableHead>Apartamento</TableHead>
                  <TableHead>Morador / Hóspede</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-center">
                    Corretor / Imobiliária
                  </TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits?.map((unit: any) => (
                  <TableRow>
                    <TableCell>{getOption(unit.statusId, statuses)}</TableCell>
                    <TableCell>{getOption(unit.blockId, blocks)}</TableCell>
                    <TableCell>
                      {getOption(
                        unit.apartamentId,
                        apartaments?.map(({ id, apartmentNumber }) => ({
                          id,
                          name: apartmentNumber,
                        })) ?? []
                      )}
                    </TableCell>
                    <TableCell>{unit.guest}</TableCell>
                    <TableCell>{unit.contact}</TableCell>
                    <TableCell className="text-center">
                      {unit.responsible}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
