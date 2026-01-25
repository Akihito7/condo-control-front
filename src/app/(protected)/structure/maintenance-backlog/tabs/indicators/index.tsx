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

import { ComposedChart, Line, CartesianGrid, Legend } from "recharts";
import { IndicatorsResume } from "@/api/fetch-resume-indicators-maintenances";
import { AreaData } from "@/api/fetch-chart-improvements-by-area";
import { MonthlyExpense } from "@/api/fetch-chart-monthly-expenses-summary";

interface DashboardProps {
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  indicatorsResume: IndicatorsResume | undefined;
  chartImprovementsByArea: AreaData[] | undefined;
  chartMonthlyExpensesSummary: MonthlyExpense[] | undefined;
}

export function Indicators({
  year,
  setYear,
  indicatorsResume,
  chartMonthlyExpensesSummary,
}: DashboardProps) {
  const componentMainRef = useRef<HTMLDivElement>(null);
  const componentFilterRef = useRef<HTMLDivElement>(null);

  const formatterToCurrency = (value: any) => {
    const valueToFormatter = value ? value : 0;
    return Number(valueToFormatter).toLocaleString("pt-BR", {
      currency: "BRL",
      style: "currency",
    });
  };

  return (
    <div className="space-y-6 pb-6" ref={componentMainRef}>
      {/* Filtros */}
      <div
        className="flex flex-col sm:flex-row gap-4 items-end"
        ref={componentFilterRef}
      >
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
            if (!componentMainRef.current || !componentFilterRef.current)
              return;
            printDocument(componentMainRef.current, componentFilterRef.current);
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
            Resumo de Obras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Obras Realizadas</p>
              <p className="text-lg font-bold">
                {indicatorsResume?.improvementsImplemented}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Custo Total</p>
              <p className="text-lg font-bold">
                {formatterToCurrency(indicatorsResume?.improvementsCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custo Médio</p>
              <p className="text-lg font-bold">
                {formatterToCurrency(indicatorsResume?.accuracyImprovementCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <p className="text-lg font-bold">
                {indicatorsResume?.accuracyExecutionDaysImprovements
                  ? `${Math.round(indicatorsResume?.accuracyExecutionDaysImprovements)} dias`
                  : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Impacto Obras</p>
              <p className="text-lg font-bold">
                {indicatorsResume?.percentageImpactImprovements}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 shadow-lg rounded-2xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Gastos Mensais com Acumulado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={chartMonthlyExpensesSummary}
              margin={{ top: 20, right: 40, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="nameMonth"
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
                dataKey="totalCoustMaintenances"
                fill="#F59E0B"
                name="Gasto Mensal"
                radius={[6, 6, 0, 0]}
                barSize={28}
                animationDuration={800}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="accumulatedBalance"
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
