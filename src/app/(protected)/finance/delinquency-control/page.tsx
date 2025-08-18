"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { FileDown, Pencil } from "lucide-react";

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

import { ModalCreateDelinquency } from "./modal-create-delinquency";
import { Button } from "@/components/ui/button";
import { MonthYearPicker } from "@/components/month-year-select";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { useDelinquencyControl } from "./use-delinquency-control";
import { Delinquency } from "@/api/fetch-delinquency-registers";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";

export default function DelinquencyControl() {
  const { edit, read } = userPagePermission({ pageId: 2 });
  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }

  const [delinquencySelected, setDelinquencySelected] = useState<Delinquency>();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [date, setDate] = useState<Date>(new Date());

  const [paymentStatus, setStatusPayment] = useState<string>("-1");

  const {
    categoriesOptions,
    categorioOptionsStatus,
    apartaments,
    delinequencyRegisters,
    handeDeleteRegister,
  } = useDelinquencyControl({ date });

  const delinquencyRegistersFiltered = delinequencyRegisters?.filter(
    (delinquencyRegister) => {
      if (paymentStatus === "-1") return true;

      if (paymentStatus === "2") {
        return delinquencyRegister.paymentDate;
      }

      return !delinquencyRegister.paymentDate;
    }
  );

  return (
    <div className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Finanças"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Inadimplência
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <MonthYearPicker selectedDate={date} onChange={setDate} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status de Pagamentos
          </label>
          <Select
            value={paymentStatus}
            defaultValue={paymentStatus}
            onValueChange={(value) => {
              setStatusPayment(value);
            }}
          >
            <SelectTrigger
              value={paymentStatus}
              className="bg-white w-[260px] min-h-[40px]"
            >
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              <SelectItem value="2">Pago</SelectItem>
              <SelectItem value="1">Pendente</SelectItem>
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
          <h2 className="font-medium text-gray-800 text-lg">
            Registros de Inadimplência
          </h2>
          {categorioOptionsStatus === "success" &&
            categoriesOptions != undefined && (
              <ModalCreateDelinquency
                categoriesOptions={categoriesOptions}
                apartaments={apartaments!}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                delinquencySelected={delinquencySelected}
                setDelinquencySelected={setDelinquencySelected}
                type={delinquencySelected ? "edit" : "create"}
              />
            )}
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Vencimento</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-left">Valor</TableHead>
                <TableHead>Data de Pagamento</TableHead>
                <TableHead className="text-left">Valor Pago</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Dias de Atraso</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delinquencyRegistersFiltered?.map((delinquencyRegister) => (
                <TableRow key={delinquencyRegister.id}>
                  <TableCell>{delinquencyRegister.dueDate}</TableCell>
                  <TableCell>{delinquencyRegister.apartamentId}</TableCell>
                  <TableCell>{delinquencyRegister.categoryName}</TableCell>
                  <TableCell className="text-left">
                    {delinquencyRegister.amount.toLocaleString("pt-br", {
                      currency: "BRL",
                      style: "currency",
                    })}
                  </TableCell>
                  <TableCell>
                    {delinquencyRegister.paymentDate
                      ? delinquencyRegister.paymentDate
                      : "-"}
                  </TableCell>
                  <TableCell className="text-left">
                    {delinquencyRegister.amountPaid?.toLocaleString("pt-br", {
                      currency: "BRL",
                      style: "currency",
                    })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        delinquencyRegister.paymentDate
                          ? "text-green-500 bg-green-100"
                          : "text-red-500 bg-red-100"
                      }`}
                    >
                      {delinquencyRegister.paymentDate ? "Pago" : "Pendente"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {delinquencyRegister.daysLate}
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setDelinquencySelected(delinquencyRegister);
                            setModalIsOpen(true);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handeDeleteRegister(delinquencyRegister.id);
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
  );
}
