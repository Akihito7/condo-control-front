"use client";

import React, { useRef } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { printDocument } from "@/utils/print-document";
import { YearSelect } from "@/components/year-select";

const impact = {
  maintenances: 5.2,
  improvements: 8.7,
};

const improvementsByArea = [
  { area: "Garagem", value: 2 },
  { area: "Fachada", value: 1 },
  { area: "Piscina", value: 1 },
  { area: "Elevador", value: 1 },
  { area: "Jardim", value: 3 },
];

import { ComposedChart, Line, CartesianGrid, Legend } from "recharts";
import { IndicatorsResume } from "@/api/fetch-resume-indicators-maintenances";

// mock de dados mensais (substituir depois pela API)
const monthlyExpenses = [
  { month: "jan/24", gasto: 15000, acumulado: 15000 },
  { month: "fev/24", gasto: 8000, acumulado: 23000 },
  { month: "mar/24", gasto: 8000, acumulado: 31000 },
  { month: "abr/24", gasto: 9000, acumulado: 40000 },
  { month: "mai/24", gasto: 15000, acumulado: 55000 },
  { month: "jun/24", gasto: 10000, acumulado: 65000 },
  { month: "jul/24", gasto: 12000, acumulado: 77000 },
  { month: "ago/24", gasto: 10000, acumulado: 87000 },
  { month: "set/24", gasto: 9000, acumulado: 96000 },
  { month: "out/24", gasto: 8000, acumulado: 104000 },
  { month: "nov/24", gasto: 13000, acumulado: 117000 },
  { month: "dez/24", gasto: 10000, acumulado: 127000 },
];

interface DashboardProps {
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  indicatorsResume: IndicatorsResume | undefined;
}

export function Indicators({
  year,
  setYear,
  indicatorsResume,
}: DashboardProps) {
  const componentFilterRef = useRef<HTMLDivElement>(null);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const costByTypeFormatted = [
    { name: "Manutenção", value: indicatorsResume?.maintenanceCost },
    { name: "Melhoria", value: indicatorsResume?.improvementsCost },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <YearSelect yearSelected={year} setYearSelected={setYear} />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
          onClick={() => {
            if (!componentFilterRef.current) return;
            printDocument(
              componentFilterRef.current,
              componentFilterRef.current
            );
          }}
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </Button>
      </div>

      {/* Resumo em Card Único */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Resumo de Manutenções & Melhorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Manutenções Realizadas
              </p>
              <p className="text-lg font-bold">
                {indicatorsResume?.maintenancePerfomed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Melhorias Realizadas
              </p>
              <p className="text-lg font-bold">
                {indicatorsResume?.improvementsImplemented}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Custo Total (Manutenção)
              </p>
              <p className="text-lg font-bold">
                R${" "}
                {indicatorsResume?.maintenanceCost?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Custo Médio (Manutenção)
              </p>
              <p className="text-lg font-bold">
                R${" "}
                {indicatorsResume?.accuracyMaintenanceCost.toLocaleString(
                  "pt-BR",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Custo Total (Melhoria)
              </p>
              <p className="text-lg font-bold">
                R${" "}
                {indicatorsResume?.improvementsCost.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Custo Médio (Melhoria)
              </p>
              <p className="text-lg font-bold">
                R${" "}
                {indicatorsResume?.accuracyImprovementCost.toLocaleString(
                  "pt-BR",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Tempo Médio (Exec. Melhoria)
              </p>
              <p className="text-lg font-bold">
                {indicatorsResume?.accuracyExecutionDaysImprovements} dias
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Impacto Manutenções
              </p>
              <p className="text-lg font-bold">MOCKADO%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Impacto Melhorias</p>
              <p className="text-lg font-bold">MOCKADO</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custo por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Custo Total por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costByTypeFormatted} barSize={30}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value.toLocaleString("pt-BR", {
                      currency: "BRL",
                      style: "currency",
                    }),
                    "Valor",
                  ]}
                />

                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Melhorias por Área */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Melhorias por Área
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={improvementsByArea} barSize={30}>
                <XAxis dataKey="area" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value, name) => [value, "Quantidade"]} />
                <Bar dataKey="value">
                  {improvementsByArea.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-1 md:col-span-2 shadow-lg rounded-2xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Gastos Mensais com Acumulado
          </CardTitle>
          <p className="text-sm text-gray-500">
            Gasto mensal em colunas e valor acumulado em linha.
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={monthlyExpenses}
              margin={{ top: 20, right: 40, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: "#D1D5DB" }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderRadius: 8,
                  border: "none",
                  color: "#FFFFFF",
                  padding: "10px",
                }}
                formatter={(value: number) =>
                  `R$ ${value.toLocaleString("pt-BR")}`
                }
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
              />
              <Bar
                yAxisId="left"
                dataKey="gasto"
                fill="#F59E0B"
                name="Gasto Mensal"
                radius={[6, 6, 0, 0]}
                barSize={28}
                animationDuration={800}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="acumulado"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#EF4444", strokeWidth: 2, fill: "#FFF" }}
                activeDot={{ r: 7 }}
                name="Acumulado"
                animationDuration={800}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
