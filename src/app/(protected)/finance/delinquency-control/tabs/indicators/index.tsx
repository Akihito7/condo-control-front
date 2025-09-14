"use client";

import { DatePickRange } from "@/components/date-pick-ranger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { printDocument } from "@/utils/print-document";
import { FileDown, Pencil } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import React, { RefObject, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIndicators } from "./use-indicators";
import { MonthYearPicker } from "@/components/month-year-select";
import { Delinquency } from "@/api/fetch-delinquency-registers";

interface IndicatorsTabProps {
  mainRef: RefObject<HTMLElement | null>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  delinequencyRegisters: Delinquency[] | undefined;
}

export function Indicators({
  mainRef,
  setDate,
  date,
  delinequencyRegisters,
}: IndicatorsTabProps) {
  const componentFilterRef = useRef<HTMLDivElement>(null);
  const {
    delinquencyResume,
    delinquencyResumeStatus,
    chartDistruibition,
    chartDistruibitionStatus,
    delinquencyMonthlyEvolution,
    delinquencyMonthlyEvolutionStatus,
  } = useIndicators({
    date,
  });

  const indicatorsToDisplay = [
    {
      label: "Pagamentos Pendentes",
      value: delinquencyResume?.totalInstallments ?? 0,
    },
    {
      label: "Unidades Inadimplentes",
      value: delinquencyResume?.uniqueApartamentsLength ?? 0,
    },
    {
      label: "Total em Aberto",
      value: delinquencyResume
        ? `R$ ${delinquencyResume.totalAmountToReceive.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`
        : "R$ 0,00",
    },
    {
      label: "Tempo Médio de Pgto.",
      value: delinquencyResume
        ? `${delinquencyResume.averageDaysOverdue} dias`
        : "0 dias",
    },
    {
      label: "% Inadimplência (Mês)",
      value: `${delinquencyResume?.delinquencyPercentage}%`,
    },
  ];

  const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

  return (
    <div className="space-y-6 pb-6">
      {/* Filtros */}
      <div
        ref={componentFilterRef}
        className="flex flex-col sm:flex-row gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <MonthYearPicker selectedDate={date} onChange={setDate} />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
          onClick={() => {
            if (!componentFilterRef.current || !mainRef.current) return;
            printDocument(mainRef.current, componentFilterRef.current);
          }}
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </Button>
      </div>

      {/* Indicadores resumidos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Resumo de Inadimplência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {indicatorsToDisplay?.map((item) => (
              <div key={item.label} className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-xl font-semibold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Evolução Mensal da Inadimplência (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={delinquencyMonthlyEvolution}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    "Inadimplência",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="delinquencyPercentage"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Distribuição por Tipo de Pendência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartDistruibition}
                  dataKey="categoryPercentage"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {chartDistruibition?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)}%`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-4 space-y-1 text-sm">
              {chartDistruibition?.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {d.categoryName} — {d.categoryPercentage}%
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Unidades com Pendências
          </h2>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {delinequencyRegisters?.map((delinquencyRegister) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
