"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePickRange } from "@/components/date-pick-ranger";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, Pencil } from "lucide-react";
import { useState } from "react";
import { differenceInMinutes, format, parseISO } from "date-fns";

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

import { Unlock, CheckCircle2, Clock, RefreshCw } from "lucide-react";

import { OpeningCard } from "./opening-card";
import { ModalActionOpeningOfCalls } from "./modal-action-opening-of-calls";
import { useOpeningCalls } from "./use-opening-calls";
import { useUserContext } from "@/providers/use-user-context";
import { CardSkeleton } from "@/components/card-skeleton";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { OpeningCall } from "@/api/get-opening-calls-records";
import { ModalAttachments } from "./modal-attachments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOpeningCallRecord } from "@/api/delete-opening-call-record";

export default function OpeningOfCalls() {
  const [rangeDate, setRangeDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [statusOptionSelected, setStatusOptionsSelected] = useState<string>();
  const [issueOptionSeleted, setIssueOptionSelected] = useState<string>("-1");
  const [openingRecordSelected, setOpeningRecordSelected] =
    useState<OpeningCall | null>(null);
  const [modalActionIsOpen, setModalActionIsOpen] = useState(false);
  const [modalDocumentsIsOpen, setModalDocumentsIsOpen] = useState(false);
  const { user } = useUserContext();

  const condominiumId = user.condominiumId;
  const queryClient = useQueryClient();

  const { mutateAsync: handleDeleteOpeningCallRecord } = useMutation({
    mutationFn: async (openingCallRecordId: number) =>
      deleteOpeningCallRecord({
        openingCallRecordId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["openingCallsRecords"],
        exact: false,
      });
    },
  });

  const {
    openingRecords,
    openingRecordsStatus,
    openingCards,
    openingCardsStatus,
    issuesOptions,
    optionsIssuesStatus,
    optionsStatus,
    statusOptions,
    employeesOptions,
    employeesOptionsStatus,
  } = useOpeningCalls({
    condominiumId,
    startDate: rangeDate.from,
    endDate: rangeDate.to,
  });

  return (
    <div className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Comunicação"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Abertura de Chamados
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <DatePickRange range={rangeDate} setRange={setRangeDate} />
        </div>

        {statusOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status chamados
            </label>

            <Select
              defaultValue={statusOptions[0].id}
              value={statusOptionSelected}
              onValueChange={(value) => setStatusOptionsSelected(value)}
            >
              <SelectTrigger className="bg-white w-[260px] min-h-[40px]">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions?.map((option: any, index: number) => (
                  <SelectItem key={index} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo Problema
          </label>
          <Select
            defaultValue={issueOptionSeleted}
            onValueChange={(value) => setIssueOptionSelected(value)}
          >
            <SelectTrigger className="bg-white w-[260px] min-h-[40px]">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              {issuesOptions?.map((option: any, index: number) => (
                <SelectItem key={index} value={option.id}>
                  {option.name}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {openingCardsStatus === "pending" ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            <OpeningCard
              title="Chamados em andamento (mês)"
              icon={<Unlock size={20} color="#22c55e" />}
              value={openingCards!.totalCallIsGoing}
            />

            <OpeningCard
              title="Chamados Resolvidos (mês)"
              icon={<CheckCircle2 size={20} color="#16a34a" />}
              value={openingCards!.totalCallsSolved}
            />

            <OpeningCard
              title="Total chamados (mês)"
              icon={<Clock size={20} color="#f59e0b" />}
              value={openingCards!.totalCallsMonth}
            />

            <OpeningCard
              title="Tempo Médio Resolução (H) (mês)"
              icon={<RefreshCw size={20} color="#3b82f6" />}
              value={openingCards!.accuracyHoursCallSolved}
            />
          </>
        )}
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Chamados</h2>

          {employeesOptions && (
            <ModalActionOpeningOfCalls
              problemTypes={issuesOptions}
              modalIsOpen={modalActionIsOpen}
              setModalIsOpen={setModalActionIsOpen}
              statuses={statusOptions}
              openingRecordSelected={openingRecordSelected}
              setOpeningRecordSelectted={setOpeningRecordSelected}
              type={openingRecordSelected ? "edit" : "create"}
              responsibles={employeesOptions}
            />
          )}

          {openingRecordSelected && modalDocumentsIsOpen && (
            <ModalAttachments
              attachments={openingRecordSelected?.attachments}
              setIsOpen={setModalDocumentsIsOpen}
              open={modalDocumentsIsOpen}
              setOpeningRecordSelectted={setOpeningRecordSelected}
              openingRecordSelected={openingRecordSelected}
            />
          )}
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo Problema</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-left">Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-left">Data início atuação</TableHead>
                <TableHead>Data Resolução</TableHead>
                <TableHead className="text-center">
                  Tempo de Resolução (Min)
                </TableHead>
                <TableHead className="text-center">Documentos</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openingRecordsStatus === "pending" ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </>
              ) : (
                openingRecords!
                  .filter((openingRecord) => {
                    const issueOptionsMatch =
                      issueOptionSeleted === "-1"
                        ? true
                        : String(openingRecord.issueTypeId) ===
                          String(issueOptionSeleted);
                    const statusSelectedInitialValue = statusOptionSelected
                      ? String(statusOptionSelected)
                      : "1";
                    const statusOptionsMatch =
                      statusSelectedInitialValue ===
                      String(openingRecord.statusId);
                    return issueOptionsMatch && statusOptionsMatch;
                  })
                  .map((openingRecord: any) => (
                    <TableRow key={openingRecord.id}>
                      <TableCell>
                        {format(parseISO(openingRecord.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{openingRecord.issueTypesName}</TableCell>
                      <TableCell>{openingRecord.description}</TableCell>
                      <TableCell className="text-left">
                        {openingRecord.userName}
                      </TableCell>
                      <TableCell>{openingRecord.callStatusesName}</TableCell>
                      <TableCell className="text-left">
                        {openingRecord.startedAt
                          ? format(
                              parseISO(openingRecord.startedAt),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {openingRecord.resolvedAt
                          ? format(
                              parseISO(openingRecord.resolvedAt),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {openingRecord.startedAt && openingRecord.resolvedAt
                          ? differenceInMinutes(
                              parseISO(openingRecord.resolvedAt),
                              parseISO(openingRecord.startedAt)
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          className="hover:underline font-medium cursor-pointer"
                          onClick={() => {
                            setOpeningRecordSelected(openingRecord);
                            setModalDocumentsIsOpen(true);
                          }}
                        >
                          {openingRecord.attachments.length}{" "}
                          {openingRecord.attachments.length <= 1
                            ? "anexo"
                            : "anexos"}
                        </button>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                            <Pencil className="w-4 h-4 text-gray-700" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setOpeningRecordSelected(openingRecord);
                                setModalActionIsOpen(true);
                              }}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteOpeningCallRecord(openingRecord.id)
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
      </section>
    </div>
  );
}
