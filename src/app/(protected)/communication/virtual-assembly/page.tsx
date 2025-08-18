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
import { DatePicker } from "@/components/date-picker";
import { useVirtualAssembly } from "./use-virtual-assembly";
import { PollWithStats } from "@/api/fetch-assembly-polls";
import { VotePollModal } from "./vote-poll-modal";
import { ActionPollModal } from "./action-poll-modal";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";

export default function VirtualAssembly() {
  const { read, edit } = userPagePermission({ pageId: 11 });
  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }

  const [date, setDate] = useState(new Date());
  const [pollSelected, setPollSelected] = useState<PollWithStats | undefined>();
  const [voteModalIsOpen, setVoteModalIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [actionPollModalIsOpen, setActionPollModalActionIsOpen] =
    useState(false);

  const renderYesNoBar = (poll: PollWithStats) => {
    if (!poll) return "-";

    return (
      <div className="w-48">
        <div className="text-xs text-muted-foreground mb-1">
          {poll.percentageYes}% /{poll.percentageNo}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
          <div
            className="bg-green-500 h-2 absolute left-0 top-0"
            style={{ width: `${poll.percentageYes}%` }}
          />
          <div
            className="bg-red-500 h-2 absolute right-0 top-0"
            style={{ width: `${poll.percentageNo}%` }}
          />
        </div>
      </div>
    );
  };

  const { polls, pollsStatus, handleDeletePoll } = useVirtualAssembly({
    date,
  });

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
          <DatePicker date={date} setDate={setDate} />
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
              {polls?.length}
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

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Enquetes</h2>

          <ActionPollModal
            isOpen={actionPollModalIsOpen}
            setIsOpen={setActionPollModalActionIsOpen}
            pollSelected={pollSelected}
            setPollSelected={setPollSelected}
            type={pollSelected ? "edit" : "create"}
          />

          <VotePollModal
            pollTitle={pollSelected?.title ?? ""}
            setIsOpen={setVoteModalIsOpen}
            isOpen={voteModalIsOpen}
            setPollSelected={setPollSelected}
            pollSelected={pollSelected}
          />
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
              {polls?.map((poll) => (
                <TableRow key={poll.id}>
                  <TableCell>{poll.title}</TableCell>
                  <TableCell>
                    {format(new Date(poll.createdAt), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(poll.endDate), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>{poll.status}</TableCell>
                  <TableCell>{poll.totalVotes}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{renderYesNoBar(poll)}</TableCell>
                  <TableCell>{poll.finalResult ?? "-"}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu
                      open={dropdownOpen}
                      onOpenChange={(open) => setDropdownOpen(open)}
                    >
                      <DropdownMenuTrigger className="outline-none">
                        <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setDropdownOpen(false);
                            setPollSelected(poll);
                            setVoteModalIsOpen(true);
                          }}
                        >
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDropdownOpen(false);
                            setPollSelected(poll);
                            setActionPollModalActionIsOpen(true);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeletePoll(poll.id)}
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
  );
}
