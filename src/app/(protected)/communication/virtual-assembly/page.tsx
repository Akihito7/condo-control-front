"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePickRange } from "@/components/date-pick-ranger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, MoreHorizontal, Users } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CreatePollModal } from "./create-poll-modal";

export default function VirtualAssembly() {
  const [rangeDate, setRangeDate] = useState({
    from: new Date(),
    to: new Date(),
  });

  const mockPolls = [
    {
      id: 1,
      title: "Aprovação do orçamento 2025",
      createdAt: "2025-07-01",
      closedAt: "2025-07-10",
      status: "Encerrada",
      totalVotes: 45,
      participation: "75%",
      result: "Aprovado",
      resultDetails: { yes: 32, no: 13 },
    },
    {
      id: 2,
      title: "Mudança no regulamento interno",
      createdAt: "2025-07-15",
      closedAt: "2025-07-20",
      status: "Aberta",
      totalVotes: 12,
      participation: "20%",
      result: "-",
      resultDetails: null,
    },
    {
      id: 3,
      title: "Pintura da fachada",
      createdAt: "2025-06-10",
      closedAt: "2025-06-18",
      status: "Encerrada",
      totalVotes: 38,
      participation: "68%",
      result: "Rejeitado",
      resultDetails: { yes: 15, no: 16 },
    },
  ];

  const renderYesNoBar = (poll: (typeof mockPolls)[0]) => {
    if (!poll.resultDetails) return "-";

    const { yes, no } = poll.resultDetails;
    const total = yes + no;
    const percentYes = Math.round((yes / total) * 100);
    const percentNo = 100 - percentYes;

    return (
      <div className="w-48">
        <div className="text-xs text-muted-foreground mb-1">
          {percentYes}% /{percentNo}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
          <div
            className="bg-green-500 h-2 absolute left-0 top-0"
            style={{ width: `${percentYes}%` }}
          />
          <div
            className="bg-red-500 h-2 absolute right-0 top-0"
            style={{ width: `${percentNo}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Comunicação"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Assembleia Digital
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <DatePickRange range={rangeDate} setRange={setRangeDate} />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="min-w-[210px] max-w-[350px]cursor-pointer flex justify-between">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 w-full">
              <CardTitle className="text-md dark:text-foreground">
                Enquetes Criadas no Mês
              </CardTitle>
              <Users />
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl md:text-3xl font-bold dark:text-foreground">
              2
            </span>
            <span className="text-[12px] dark:text-foreground">
              Total de novas enquetes neste mês.
            </span>
          </CardContent>
        </Card>

        <Card className="min-w-[210px] max-w-[350px]cursor-pointer flex justify-between">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 w-full">
              <CardTitle className="text-md dark:text-foreground">
                Participação Média
              </CardTitle>
              <Users />
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl md:text-3xl font-bold dark:text-foreground">
              0.0%
            </span>
            <span className="text-[12px] dark:text-foreground">
              Média de participação nas enquetes encerradas.
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Enquetes</h2>

          <CreatePollModal />
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Título Enquete</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Data Encerramento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Votos</TableHead>
                <TableHead>Participação</TableHead>
                <TableHead>Sim / Não</TableHead>
                <TableHead>Resultado Final</TableHead>
                <TableHead className="text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPolls.map((poll) => (
                <TableRow key={poll.id}>
                  <TableCell>{poll.title}</TableCell>
                  <TableCell>
                    {format(new Date(poll.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(poll.closedAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{poll.status}</TableCell>
                  <TableCell>{poll.totalVotes}</TableCell>
                  <TableCell>{poll.participation}</TableCell>
                  <TableCell>{renderYesNoBar(poll)}</TableCell>
                  <TableCell>{poll.result}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Visualizar</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
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
  );
}
