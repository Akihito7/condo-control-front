"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
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
import { useDailyRequests } from "./use-daily-requests";
import { Button } from "@/components/ui/button";
import { FileDown, MoreHorizontal } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { ModalAction } from "./modal-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommandDelete } from "@/commands/use-command.delete";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-red-500 text-white", // Alta
  2: "bg-green-500 text-white", // Baixa
  3: "bg-yellow-400 text-black", // Média
};

const STATUS_COLORS: Record<number, string> = {
  1: "bg-white text-gray-800 border border-gray-300", // Pendente
  2: "bg-blue-500 text-white", // Em andamento
  3: "bg-green-500 text-white", // Finalizada
};

const badgeBase =
  "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap";

// Helper para labels do mobile
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

export default function DailyRequests() {
  const {
    date,
    setDate,
    gravitiesOptions,
    responsibleOptions,
    statusOptions,
    dailyRequestRegisters,
    dailyRequestRegistersStatus,
    gravityId,
    responsibleName,
    setGravityId,
    setResponsibleName,
  } = useDailyRequests();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [dropDownItemSelected, setDropDownItemSelected] = useState<
    number | null
  >(null);
  const [dailySelected, setDailySelected] = useState<any>(undefined);

  const filteredDailyRequests = React.useMemo(() => {
    return dailyRequestRegisters?.filter((item: any) => {
      if (gravityId && String(item.gravityId) !== gravityId) return false;
      if (
        responsibleName &&
        !item.responsibleName
          .toLocaleLowerCase()
          .includes(responsibleName.toLocaleLowerCase())
      )
        return false;
      return true;
    });
  }, [dailyRequestRegisters, gravityId, responsibleName]);

  const getGravityName = (gravityId: number | string) => {
    return (
      gravitiesOptions?.find((g) => String(g.id) === String(gravityId))?.name ||
      "-"
    );
  };

  const getStatusName = (statusId: number | string) => {
    return (
      statusOptions?.find((s) => String(s.id) === String(statusId))?.name || "-"
    );
  };

  const queryClient = useQueryClient();

  function onDeleteSuccess() {
    queryClient.invalidateQueries({ exact: false, queryKey: ["daily"] });
  }

  const { execute: handleDeleteRegister } = useCommandDelete({
    onSuccess: onDeleteSuccess,
  });

  return (
    <main className="bg-gray-50 w-full p-4 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-4 sm:mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Tarefas do dia</h1>
      </div>

      <div className="space-y-6">
        {/* Filtros Responsivos */}
        <div className="flex flex-col gap-4 md:items-end md:flex-row">
          <div className="w-full md:w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Data da Tarefa
            </label>
            <DatePicker setDate={setDate} date={date} />
          </div>

          <div className="w-full md:w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Prioridade
            </label>
            <Select value={gravityId} onValueChange={setGravityId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                {gravitiesOptions?.map(({ id, name }) => (
                  <SelectItem key={id} value={id.toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Responsável
            </label>
            <Input
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2 h-10 w-full md:w-auto md:ml-auto"
          >
            <FileDown className="w-6 h-6" />
            Exportar PDF
          </Button>
        </div>

        <section className="rounded-xl border bg-white overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800 text-lg">Tarefas</h2>
            <ModalAction
              gravities={gravitiesOptions}
              statuses={statusOptions}
              type={dailySelected ? "edit" : "create"}
              dailyRequest={dailySelected}
              setDailyRequest={setDailySelected}
              isOpen={modalIsOpen}
              setIsOpen={setModalIsOpen}
            />
          </div>

          {/* 📱 VIEW MOBILE (Cards com Scroll Natural) */}
          <div className="md:hidden p-4 space-y-4 bg-gray-50/30">
            {dailyRequestRegistersStatus === "pending" ? (
              <p className="text-center py-4 text-gray-500">Carregando...</p>
            ) : filteredDailyRequests?.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                Nenhuma tarefa encontrada.
              </p>
            ) : (
              filteredDailyRequests?.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 text-base">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <DropdownMenu
                      open={dropDownIsOpen && dropDownItemSelected === item.id}
                      onOpenChange={(open) => {
                        setDropDownItemSelected(item.id);
                        setDropDownIsOpen(open);
                      }}
                    >
                      <DropdownMenuTrigger className="p-2 -mr-2 outline-none">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setModalIsOpen(true);
                            setDailySelected(item);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteRegister({
                              registerId: item.id,
                              tableName: "task_day",
                            })
                          }
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
                    <InfoField
                      label="Responsável"
                      value={item.responsibleName}
                    />
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Prioridade
                      </p>
                      <span
                        className={`${badgeBase} ${PRIORITY_COLORS[item.gravityId] ?? "bg-gray-200 text-gray-800"}`}
                      >
                        {getGravityName(item.gravityId)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <InfoField label="Observações" value={item.observation} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <span
                      className={`${badgeBase} ${STATUS_COLORS[item.statusId] ?? "bg-gray-200 text-gray-800"}`}
                    >
                      {getStatusName(item.statusId)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 📋 VIEW DESKTOP (Tabela Original com Scroll Interno) */}
          <div className="hidden md:block">
            <div className="max-h-[70vh] overflow-y-auto border-gray-300">
              <Table className="min-w-full border-collapse">
                <TableHeader className="sticky top-0 bg-white shadow-md z-10">
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead className="text-left">Responsável</TableHead>
                    <TableHead className="text-left">Observações</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyRequestRegistersStatus === "pending" ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredDailyRequests?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        Nenhuma tarefa encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDailyRequests?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`${badgeBase} ${PRIORITY_COLORS[item.gravityId] ?? "bg-gray-200 text-gray-800"}`}
                          >
                            {getGravityName(item.gravityId)}
                          </span>
                        </TableCell>
                        <TableCell>{item?.responsibleName}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {item.observation || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`${badgeBase} ${STATUS_COLORS[item.statusId] ?? "bg-gray-200 text-gray-800"}`}
                          >
                            {getStatusName(item.statusId)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu
                            open={
                              dropDownIsOpen && dropDownItemSelected === item.id
                            }
                            onOpenChange={(open) => {
                              setDropDownItemSelected(item.id);
                              setDropDownIsOpen(open);
                            }}
                          >
                            <DropdownMenuTrigger className="outline-none">
                              <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setModalIsOpen(true);
                                  setDailySelected(item);
                                }}
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteRegister({
                                    registerId: item.id,
                                    tableName: "task_day",
                                  })
                                }
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
          </div>
        </section>
      </div>
    </main>
  );
}
