"use client";

import { Intervention } from "@/api/fetch-interventions";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, FileDown, Pencil, TrendingUp, Wallet } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@radix-ui/react-label";
import { format, parseISO } from "date-fns";
import { YearSelect } from "@/components/year-select";
import { ModalActionIntervention } from "../../modal-action-intervation";
import { CardMaintenance } from "../../card-maintenance";
import { AreasOptions } from "@/api/fetch-condominium-areas";
import { FinancialSummary } from "@/api/fetch-intervention-cards";
import { MaintenanceStatusOption } from "@/api/fetch-maintenances-status";
import { TypesOption } from "@/api/fetch-maintenances-types";
import { PaymentMethod } from "@/api/fetch-payment-method.options";
import { PriorityOption } from "@/api/fetch-priority-options";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { printDocument } from "@/utils/print-document";

interface InterventionsProps {
  priorityOptions: PriorityOption[] | undefined;
  interventionsCards: FinancialSummary | undefined;
  paymentMethodsOptions: PaymentMethod[] | undefined;
  areasOptions: AreasOptions[] | undefined;
  maintenancesTypes: TypesOption[] | undefined;
  maintenancesStatusOptions: MaintenanceStatusOption[] | undefined;
  interventions: Intervention[] | undefined;
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteIntervention: UseMutateAsyncFunction<
    void,
    Error,
    number,
    unknown
  >;
}

export function Interventions({
  areasOptions,
  interventions,
  interventionsCards,
  maintenancesStatusOptions,
  maintenancesTypes,
  paymentMethodsOptions,
  priorityOptions,
  year,
  setYear,
  handleDeleteIntervention,
}: InterventionsProps) {
  const [statusSelected, setStatusSelected] = useState("-1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] =
    useState<number>();

  const [interventionSelected, setInterventionSelected] =
    useState<Intervention>();

  const [modalTypeAction, setModalTypeAction] = useState<
    "create" | "edit" | "view"
  >("create");

  const componentMainRef = useRef<HTMLDivElement>(null);
  const componentFilterRef = useRef<HTMLDivElement>(null);

  const [modalActionInvervationIsOpen, setModalActionIntervationIsOpen] =
    useState(false);

  const filteredInterventions =
    interventions?.filter((intervention: any) => {
      if (statusSelected === "-1") return true;
      return statusSelected === String(intervention.statusId);
    }) ?? [];

  return (
    <div className="space-y-6" ref={componentMainRef}>
      {/* filtros */}
      <div
        className="flex flex-col gap-4 md:flex-row md:items-end"
        ref={componentFilterRef}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano de referência
            </label>
            <YearSelect yearSelected={year} setYearSelected={setYear} />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </Label>
            <Select value={statusSelected} onValueChange={setStatusSelected}>
              <SelectTrigger className="w-full md:w-[200px] h-10">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Todos</SelectItem>
                {maintenancesStatusOptions?.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10"
          onClick={() => {
            if (!componentFilterRef.current || !componentMainRef.current)
              return;
            printDocument(
              componentMainRef.current,
              componentFilterRef.current,
              "l",
            );
          }}
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </Button>
      </div>

      {/* cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardMaintenance
          amount={interventionsCards?.balance ?? 0}
          title="Saldo Atual"
          icon={<Wallet className="text-blue-400" />}
        />
        <CardMaintenance
          amount={interventionsCards?.approvedImprovementsCost ?? 0}
          title="Custo Melhorias"
          icon={<TrendingUp className="text-orange-400" />}
        />
        <CardMaintenance
          amount={interventionsCards?.newMonthlyFixedCosts ?? 0}
          title="Novos Custos Fixos Mensais"
          icon={<CreditCard className="text-green-400" />}
        />
      </div>

      <section className="rounded-xl border overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-medium text-gray-800 text-lg">
            Backlog de Manutenções
          </h2>

          <ModalActionIntervention
            isOpen={modalActionInvervationIsOpen}
            setIsOpen={setModalActionIntervationIsOpen}
            priorityOptions={priorityOptions}
            paymentMethodsOptions={paymentMethodsOptions}
            areasOptions={areasOptions}
            typesOptions={maintenancesTypes}
            statusOptions={maintenancesStatusOptions}
            interventionSelected={interventionSelected}
            setInterventionSelected={setInterventionSelected}
            type={modalTypeAction}
            setModalTypeAction={setModalTypeAction}
          />
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-4 p-4">
          {filteredInterventions.map((item: any) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 space-y-3 text-sm"
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: item.prioritiesColor }}
                >
                  {item.prioritiesName}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setModalTypeAction("edit");
                        setInterventionSelected(item);
                        setModalActionIntervationIsOpen(true);
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setModalTypeAction("view");
                        setInterventionSelected(item);
                        setModalActionIntervationIsOpen(true);
                      }}
                    >
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteIntervention(item.id)}
                    >
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p>
                <strong>Tipo:</strong> {item.maintenanceTypesName}
              </p>
              <p>
                <strong>Descrição:</strong> {item.description}
              </p>
              <p>
                <strong>Fornecedor:</strong> {item.supplier}
              </p>

              <p>
                <strong>Valor:</strong>{" "}
                {item.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              <p>
                <strong>Nº Parcelas:</strong> {item.numberOfInstallments ?? "-"}
              </p>

              <p>
                <strong>Valor da Parcela:</strong>{" "}
                {item.isInstallment
                  ? (item.amount / item.numberOfInstallments).toLocaleString(
                      "pt-BR",
                      { style: "currency", currency: "BRL" },
                    )
                  : "-"}
              </p>

              <p>
                <strong>Forma de Pagamento:</strong> {item.paymentMethodsName}
              </p>

              <p>
                <strong>Data de Pagamento:</strong>{" "}
                {item.paymentDate
                  ? parseISO(item.paymentDate).toLocaleDateString("pt-BR")
                  : "-"}
              </p>

              <p>
                <strong>Conclusão do Pagamento:</strong>{" "}
                {item.paymentCompletionDate
                  ? new Date(item.paymentCompletionDate).toLocaleDateString(
                      "pt-BR",
                    )
                  : "-"}
              </p>

              <p>
                <strong>Início Planejado:</strong>{" "}
                {item.plannedStart
                  ? format(item.plannedStart as any, "dd/MM/yyyy HH:mm")
                  : "-"}
              </p>

              <p>
                <strong>Início Real:</strong>{" "}
                {item.actualStart
                  ? format(item.actualStart as any, "dd/MM/yyyy HH:mm")
                  : "-"}
              </p>

              <p>
                <strong>Fim Planejado:</strong>{" "}
                {item.plannedEnd
                  ? format(item.plannedEnd as any, "dd/MM/yyyy HH:mm")
                  : "-"}
              </p>

              <p>
                <strong>Fim Real:</strong>{" "}
                {item.actualEnd
                  ? format(item.actualEnd as any, "dd/MM/yyyy HH:mm")
                  : "-"}
              </p>

              <p>
                <strong>Status:</strong> {item.maintenanceStatusesName}
              </p>
            </div>
          ))}
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded hidden md:block">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Prioridade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-left">Valor</TableHead>
                <TableHead className="text-center">Nu. Parcelas</TableHead>
                <TableHead className="text-left">Valor da Parcela</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Data de Pagamento</TableHead>
                <TableHead>Conclusão do Pagamento</TableHead>
                <TableHead className="text-center">Inicio Planejado</TableHead>
                <TableHead className="text-center">Inicio Real</TableHead>
                <TableHead className="text-center">Fim Planejado</TableHead>
                <TableHead className="text-center">Fim Real</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interventions && interventions.length > 0 ? (
                interventions
                  .filter((intervention: any) => {
                    const statusMatch =
                      statusSelected === "-1"
                        ? true
                        : statusSelected === String(intervention.statusId);

                    return statusMatch;
                  })
                  .map((item: any) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: `${item.prioritiesColor}`,
                            }}
                          >
                            {item.prioritiesName}
                          </span>
                        </TableCell>

                        <TableCell>{item.maintenanceTypesName}</TableCell>

                        <TableCell>{item.description}</TableCell>

                        <TableCell>{item.supplier}</TableCell>

                        <TableCell className="text-left">
                          {item.amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.numberOfInstallments ?? "-"}
                        </TableCell>

                        <TableCell>
                          {item.isInstallment
                            ? (
                                item.amount / item.numberOfInstallments
                              ).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })
                            : "-"}
                        </TableCell>

                        <TableCell>{item.paymentMethodsName}</TableCell>

                        <TableCell>
                          {item.paymentDate
                            ? parseISO(item.paymentDate).toLocaleDateString(
                                "pt-BR",
                              )
                            : "-"}
                        </TableCell>

                        <TableCell>
                          {item.paymentCompletionDate
                            ? new Date(
                                item.paymentCompletionDate,
                              ).toLocaleDateString("pt-BR")
                            : "-"}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.plannedStart
                            ? format(
                                item.plannedStart as any,
                                "dd/MM/yyyy HH:ss",
                              )
                            : "-"}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.actualStart
                            ? format(
                                item.actualStart as any,
                                "dd/MM/yyyy HH:ss",
                              )
                            : "-"}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.plannedEnd
                            ? format(item.plannedEnd as any, "dd/MM/yyyy HH:ss")
                            : "-"}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.actualEnd
                            ? format(item.actualEnd as any, "dd/MM/yyyy HH:ss")
                            : "-"}
                        </TableCell>
                        <TableCell>{item.maintenanceStatusesName}</TableCell>

                        <TableCell className="text-center">
                          <DropdownMenu
                            open={
                              dropdownOpen && dropdownOpenToThisItem === item.id
                            }
                            onOpenChange={(open) => {
                              if (!open) {
                                setDropdownOpenToThisItem(undefined);
                              } else {
                                setDropdownOpenToThisItem(item.id);
                              }
                              setDropdownOpen(open);
                            }}
                          >
                            <DropdownMenuTrigger
                              asChild
                              className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 text-gray-700" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDropdownOpen(false);
                                  setModalTypeAction("edit");
                                  setInterventionSelected(item);
                                  setModalActionIntervationIsOpen(true);
                                }}
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDropdownOpen(false);
                                  setModalTypeAction("view");
                                  setInterventionSelected(item);
                                  setModalActionIntervationIsOpen(true);
                                }}
                              >
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleDeleteIntervention(item.id);
                                }}
                              >
                                Deletar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-4 text-gray-500"
                  >
                    No interventions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
