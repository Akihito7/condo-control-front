"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaDollarSign } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DatePickRange } from "@/components/date-pick-ranger";
import { CardFinance } from "@/components/card-finance";
import { DollarSign, FileDown, TrendingDown, TrendingUp } from "lucide-react";
import { ModalCreateEntry } from "./modal-create-entry";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export default function Finance() {
  const transactions = [
    {
      id: 1,
      description: "Salário",
      amount: 5000,
      type: "income",
      date: "2023-05-01",
    },
    {
      id: 2,
      description: "Aluguel",
      amount: 1200,
      type: "expense",
      date: "2023-05-05",
    },
    {
      id: 3,
      description: "Supermercado",
      amount: 350,
      type: "expense",
      date: "2023-05-10",
    },
    {
      id: 4,
      description: "Freelance",
      amount: 800,
      type: "income",
      date: "2023-05-15",
    },
  ];

  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <main className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <Breadcrumb paths={["Início", "Finanças"]} />
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral Financeira
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o periodo
          </label>
          <DatePickRange range={range} setRange={setRange} />
        </div>

        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de registros
          </label>
          <Select onValueChange={(value) => console.log("Selecionado:", value)}>
            <SelectTrigger className="bg-white w-[260px] min-h-[40px]">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardFinance
          title="Receita Total"
          value={4800}
          percentage={20}
          icon={<TrendingUp color="#22c55e" />}
        />

        <CardFinance
          title="Despesas Totais"
          value={2200}
          percentage={90}
          icon={<TrendingDown color="#ef4444" />}
          type="expensive"
        />

        <CardFinance
          title="Saldo"
          value={500}
          percentage={40}
          icon={<DollarSign color="#22c55e" />}
        />
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Transações Recentes
          </h2>
          <ModalCreateEntry />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.description}
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {transaction.type === "income" ? "Receita" : "Despesa"}
                </TableCell>
                <TableCell className="text-sm">{transaction.date}</TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
