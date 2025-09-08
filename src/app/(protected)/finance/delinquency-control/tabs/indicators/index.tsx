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
import { RefObject, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIndicators } from "./use-indicators";

interface IndicatorsTabProps {
  mainRef: RefObject<HTMLElement | null>;
}

export function Indicators({ mainRef }: IndicatorsTabProps) {
  const componentFilterRef = useRef<HTMLDivElement>(null);
  const {
    range,
    setRange,
    delinquencyResume,
    delinquencyResumeStatus,
    chartDistruibition,
  } = useIndicators();

  console.log("chart distruibition =>", chartDistruibition);

  const indicatorsToDisplay = [
    {
      label: "Mensalidades Pendentes",
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
      value: "Mockado 0%",
    },
    {
      label: "% Inadimplência (Acum.)",
      value: "Mockado 0%",
    },
  ];

  // Mock - evolução mensal
  const monthlyEvolution = [
    { mes: "Jan", valor: 3.2 },
    { mes: "Fev", valor: 6.1 },
    { mes: "Mar", valor: 4.0 },
    { mes: "Abr", valor: 7.2 },
    { mes: "Mai", valor: 5.9 },
    { mes: "Jun", valor: 6.5 },
  ];

  // Mock - distribuição por tipo
  const distribution = [
    { name: "Taxa Condominial", value: 68.6 },
    { name: "Fundo de Reserva", value: 11.8 },
    { name: "Multa", value: 14.4 },
    { name: "Outros", value: 5.2 },
  ];
  const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

  // Mock - tabela de pendências
  const tableData = [
    {
      unidade: "101-B",
      mes: "Junho/2025",
      tipo: "Taxa Condominial",
      valor: "R$ 850,00",
      atraso: "15",
    },
    {
      unidade: "203-A",
      mes: "Maio/2025",
      tipo: "Taxa Condominial",
      valor: "R$ 850,00",
      atraso: "46",
    },
    {
      unidade: "203-A",
      mes: "Junho/2025",
      tipo: "Multa",
      valor: "R$ 50,00",
      atraso: "15",
    },
    {
      unidade: "405-C",
      mes: "Junho/2025",
      tipo: "Taxa Condominial",
      valor: "R$ 920,00",
      atraso: "12",
    },
    {
      unidade: "301-A",
      mes: "Abril/2025",
      tipo: "Fundo de Reserva",
      valor: "R$ 120,00",
      atraso: "75",
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      <h1 className="text-4xl text-red-400 font-bold">DADOS MOCKADOS</h1>
      {/* Filtros */}
      <div
        ref={componentFilterRef}
        className="flex flex-col sm:flex-row gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intervalo de Tempo
          </label>
          <DatePickRange
            range={range}
            setRange={setRange}
            className="text-gray-800"
          />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Evolução Mensal da Inadimplência (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyEvolution}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
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
                <Tooltip />
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
                <TableHead>Unidade</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-left">Valor Pendente</TableHead>
                <TableHead className="text-center">Dias em Atraso</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.unidade}</TableCell>
                  <TableCell>{row.mes}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell className="text-left">{row.valor}</TableCell>
                  <TableCell className="text-center">{row.atraso}</TableCell>
                  <TableCell className="text-center">
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer" />
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
