"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Label } from "@radix-ui/react-label";
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
import { DatePickRange } from "@/components/date-pick-ranger";
import { Input } from "@/components/ui/input";
import { useUnitWorks } from "./use-unit-works";
import { Button } from "@/components/ui/button";
import { FileDown, Paperclip } from "lucide-react";
import { ModalActionMaintenance } from "./modal-action-maintenance";

export default function UnitWorks() {
  const { range, setRange, unitWorksStatuses, apartaments, unitWorks } =
    useUnitWorks();

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
            <Label>Previsão</Label>
            <DatePickRange setRange={setRange} range={range} className="h-9" />
          </div>

          <div className="w-[250px] space-y-2">
            <Label>Apartamentos</Label>
            <Input
              placeholder="21"
              style={{ height: 39 }}
              value={apartmentFilter}
              onChange={(e) => setApartmentFilter(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
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
            />
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            console.log("open attachments", work.id)
                          }
                        >
                          <Paperclip className="w-5 h-5" />
                        </Button>
                      </TableCell>

                      <TableCell className="text-center">
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
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
