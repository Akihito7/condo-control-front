"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePickRange } from "@/components/date-pick-ranger";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Pencil, UserRoundX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModalRegisterVisitor } from "./modal-register-visitor";
import { useVisitorRegistration } from "./use-visitor-registration";
import { format, parseISO } from "date-fns";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";
import { NotificationDropdown } from "@/components/notification";

export default function VistitorRegistration() {
  const { read, edit } = userPagePermission({ pageId: 12 });
  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [search, setSearch] = useState("");

  const {
    visitors,
    visitorsStatus,
    handleDoneCheckout,
    apartaments,
    apartamentsStatus,
  } = useVisitorRegistration({
    startDate: range.from,
    endDate: range.to,
  });

  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Segurança"]} />
          <div className="ml-auto">
            <NotificationDropdown />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Registro de Visitantes
        </h1>
      </div>

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o período
          </label>
          <DatePickRange range={range} setRange={setRange} />
        </div>
        <div className="w-[250px] max-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar (Nome, CPF, Unidade)
          </label>
          <Input
            className="h-10"
            placeholder="Digite para buscar..."
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
            }}
          />
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
          <h2 className="font-medium text-gray-800  text-md md:text-lg">
            Visitantes
          </h2>

          <ModalRegisterVisitor
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            apartaments={apartaments}
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead className="w-[20%]">Entrada</TableHead>
                <TableHead>Nomes Completo</TableHead>
                <TableHead>CPFs</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead className="text-center">Unidade</TableHead>
                <TableHead className="text-center">Saída</TableHead>
                <TableHead className="text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visitorsStatus === "pending" ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                <>
                  {visitors
                    ?.filter((visitor) => {
                      if (!search) {
                        return true;
                      }

                      const nameMatch = visitor.personVisit.some((person) =>
                        person.fullName
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      );

                      const cpfMatch = visitor.personVisit.some((person) =>
                        person.cpf.toLowerCase().includes(search.toLowerCase())
                      );

                      const unitMatch = visitor.apartmentApartmentNumber
                        .toLowerCase()
                        .includes(search.toLowerCase());

                      return nameMatch || cpfMatch || unitMatch;
                    })
                    .map((visitor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {visitor.checkIn
                            ? format(
                                parseISO(visitor.checkIn),
                                "dd/MM/yyyy HH:mm"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell className="capitalize text-sm">
                          {visitor.personVisit
                            .map((person) => person.fullName)
                            .map((name, i) => (
                              <span key={i}>
                                {name}
                                <br />
                              </span>
                            ))}
                        </TableCell>
                        <TableCell>
                          {visitor.personVisit
                            .map((person) => person.cpf)
                            .map((cpf, i) => (
                              <span key={i}>
                                {cpf}
                                <br />
                              </span>
                            ))}
                        </TableCell>

                        <TableCell className="text-center">
                          {visitor.visitType}
                        </TableCell>
                        <TableCell className="text-sm">
                          {visitor.personVisit?.[0]?.vehicle ?? "-"}
                        </TableCell>
                        <TableCell className="text-sm text-center">
                          {visitor.apartmentApartmentNumber ?? "-"}
                        </TableCell>
                        <TableCell className="text-sm text-center">
                          {visitor.checkOut
                            ? format(
                                parseISO(visitor.checkOut),
                                "dd/MM/yyyy HH:mm"
                              )
                            : "-"}
                        </TableCell>

                        <TableCell className="text-center">
                          {!visitor.checkOut && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                                <Pencil className="w-4 h-4 text-gray-700" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleDoneCheckout(visitor.id);
                                  }}
                                >
                                  <UserRoundX className="w-4 h-4 text-red-500" />
                                  Marcar Saída
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
