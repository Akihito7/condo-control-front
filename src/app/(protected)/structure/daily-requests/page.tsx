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
    responsibleId,
    setGravityId,
    setResponsibleId,
  } = useDailyRequests();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [dropDownItemSelected, setDropDownItemSelected] = useState<
    number | null
  >(null);
  const [dailySelected, setDailySelected] = useState<any>(undefined);

  const filteredDailyRequests = React.useMemo(() => {
    return dailyRequestRegisters?.filter((item: any) => {
      if (gravityId && String(item.gravityId) !== gravityId) {
        return false;
      }

      if (responsibleId && String(item.responsibleId) !== responsibleId) {
        return false;
      }

      return true;
    });
  }, [dailyRequestRegisters, gravityId, responsibleId]);

  const getGravityName = (gravityId: number | string) => {
    return (
      gravitiesOptions?.find((g) => String(g.id) === String(gravityId))?.name ||
      "-"
    );
  };

  const getResponsibleName = (responsibleId: number | string) => {
    return (
      responsibleOptions?.find((r) => String(r.id) === String(responsibleId))
        ?.name || "-"
    );
  };

  const getStatusName = (statusId: number | string) => {
    return (
      statusOptions?.find((s) => String(s.id) === String(statusId))?.name || "-"
    );
  };

  const queryClient = useQueryClient();

  function onDeleteSuccess() {
    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["daily"],
    });
  }
  const { execute: handleDeleteRegister } = useCommandDelete({
    onSuccess: onDeleteSuccess,
  });

  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Tarefas do dia</h1>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:items-end md:flex-row">
          <div className="w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Tarefa
            </label>
            <DatePicker setDate={setDate} date={date} />
          </div>

          <div className="w-[250px] space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>

            <Select value={gravityId} onValueChange={setGravityId}>
              <SelectTrigger className="col-span-3 w-full">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsável
            </label>

            <Select value={responsibleId} onValueChange={setResponsibleId}>
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {responsibleOptions?.map(({ id, name }) => (
                  <SelectItem key={id} value={id.toString()}>
                    {name}
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
            <h2 className="font-medium text-gray-800 text-lg">Tarefas</h2>

            <ModalAction
              gravities={gravitiesOptions}
              responsibles={responsibleOptions}
              statuses={statusOptions}
              type={dailySelected ? "edit" : "create"}
              dailyRequest={dailySelected}
              setDailyRequest={setDailySelected}
              isOpen={modalIsOpen}
              setIsOpen={setModalIsOpen}
            />
          </div>

          <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
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
                {dailyRequestRegistersStatus === "pending" && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Carregando...
                    </TableCell>
                  </TableRow>
                )}

                {dailyRequestRegistersStatus !== "pending" &&
                  filteredDailyRequests?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        Nenhuma tarefa encontrada.
                      </TableCell>
                    </TableRow>
                  )}

                {filteredDailyRequests?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>

                    <TableCell>
                      {new Date(item.date).toLocaleDateString("pt-BR")}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`${badgeBase} ${
                          PRIORITY_COLORS[item.gravityId] ??
                          "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {getGravityName(item.gravityId)}
                      </span>
                    </TableCell>

                    <TableCell>
                      {getResponsibleName(item.responsibleId)}
                    </TableCell>

                    <TableCell className="max-w-[300px] truncate">
                      {item.observation || "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`${badgeBase} ${
                          STATUS_COLORS[item.statusId] ??
                          "bg-gray-200 text-gray-800"
                        }`}
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
                              setDropDownIsOpen(false);
                              setDropDownItemSelected(null);
                              setModalIsOpen(true);
                              setDailySelected(item);
                            }}
                          >
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              handleDeleteRegister({
                                registerId: item.id,
                                tableName: "task_day",
                              });
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
      </div>
    </main>
  );
}
