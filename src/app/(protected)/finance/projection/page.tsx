"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { DatePicker } from "@/components/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CardFinance } from "@/components/card-finance";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  PiggyBank,
  FileDown,
} from "lucide-react";
import { CardProjection } from "./card-projection";
import { MonthYearPicker } from "@/components/month-year-select";

export default function FinancialForecast() {
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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    console.log("new date", selectedDate);
  }, [selectedDate]);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <Breadcrumb paths={["Início", "Finanças"]} />
        <h1 className="text-2xl font-semibold text-gray-800">
          Previsões Financeiras
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <MonthYearPicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardProjection
          title="Receitas Projetadas"
          amount={1200}
          icon={<TrendingUp color="#22c55e" />}
        />

        <CardProjection
          title="Despesas Projetadas"
          amount={1200}
          icon={<TrendingDown color="#ef4444" />}
        />

        <CardProjection
          title="Saldo Projetado Mês"
          amount={1200}
          icon={<DollarSign color="#2768bd" />}
        />

        <CardProjection
          title="Saldo Projetado Total"
          amount={1200}
          icon={<PiggyBank color="#9f22c5" />}
        />
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Detalhes da Projeção
          </h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead className="w-[50%]">Mês</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor Projetado</TableHead>
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
                    {transaction.amount.toLocaleString("pt-BR")}
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
