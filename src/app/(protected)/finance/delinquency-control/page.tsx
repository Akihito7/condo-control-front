"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { FileDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModalCreateDelinquency } from "./modal-create-delinquency";
import { Button } from "@/components/ui/button";

export default function DelinquencyControl() {
  const transactions = [
    {
      id: 1,
      vencimento: "2023-07-01",
      apartamento: "101",
      tipo: "Condomínio",
      valor: 500,
      dataPagamento: "2023-07-03",
      valorPago: 500,
      status: "Pago",
      diasAtraso: 2,
    },
    {
      id: 2,
      vencimento: "2023-07-01",
      apartamento: "102",
      tipo: "Condomínio",
      valor: 500,
      dataPagamento: null,
      valorPago: 0,
      status: "Pendente",
      diasAtraso: 5,
    },
  ];

  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <Breadcrumb paths={["Início", "Finanças"]} />
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Inadimplência
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <DatePicker date={date} setDate={setDate} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status de Pagamentos
          </label>
          <Select onValueChange={(value) => console.log("Selecionado:", value)}>
            <SelectTrigger className="bg-white w-[260px] min-h-[40px]">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="ml-auto flex items-center gap-2 h-10 cursor-pointer">
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Registros de Inadimplência
          </h2>
          <ModalCreateDelinquency />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vencimento</TableHead>
              <TableHead>Apartamento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-left">Valor</TableHead>
              <TableHead>Data de Pagamento</TableHead>
              <TableHead className="text-left">Valor Pago</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Dias de Atraso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.vencimento}</TableCell>
                <TableCell>{t.apartamento}</TableCell>
                <TableCell>{t.tipo}</TableCell>
                <TableCell className="text-left">
                  R$ {t.valor.toFixed(2)}
                </TableCell>
                <TableCell>{t.dataPagamento ? t.dataPagamento : "-"}</TableCell>
                <TableCell className="text-left">
                  R$ {t.valorPago.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      t.status === "Pago"
                        ? "text-green-500 bg-green-100"
                        : "text-red-500 bg-red-100"
                    }`}
                  >
                    {t.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">{t.diasAtraso}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
