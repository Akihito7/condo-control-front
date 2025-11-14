"use client";

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { YearSelect } from "@/components/year-select";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSummaryMaintenance } from "@/api/fetch-summary-maintenance";
import { Skeleton } from "@/components/ui/skeleton";

export function Indicators() {
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const { data: summary, status } = useQuery({
    queryKey: ["summary", year],
    queryFn: () => fetchSummaryMaintenance(year),
    enabled: !!year,
  });

  const cards = summary?.cards ?? {
    total: 0,
    preventives: 0,
    correctives: 0,
    totalAmount: 0,
    averageAmount: 0,
  };

  const charts = summary?.charts ?? {
    monthlyCosts: [],
    maintenanceTypes: [],
    topAssets: [],
  };

  const formatterToCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const PIE_COLORS = ["#4ade80", "#f87171"];
  const LINE_COLOR = "#3b82f6";

  return (
    <div className="space-y-6 pb-6">
      {/* filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Ano de referência
          </label>
          <YearSelect yearSelected={year} setYearSelected={setYear} />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </Button>
      </div>

      {/* Cards */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="mb-4 border-b pb-2">
          <h2 className="text-gray-800 font-semibold text-lg">
            Resumo de Manutenções
          </h2>
          <p className="text-gray-500 text-sm">
            Visão geral dos dados de manutenção.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          <div>
            <p className="text-sm text-gray-500">Total de Manutenções</p>
            <p className="text-lg font-semibold">{cards.total}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">% de Preventivas</p>
            <p className="text-lg font-semibold text-emerald-600">
              {cards.total
                ? ((cards.preventives / cards.total) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Custo Total</p>
            <p className="text-lg font-semibold text-primary">
              {formatterToCurrency(cards.totalAmount)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Custo Médio</p>
            <p className="text-lg font-semibold text-gray-600">
              {formatterToCurrency(cards.averageAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Grid charts */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Pizza Preventivas / Corretivas */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-md p-4">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-gray-800 font-semibold text-lg">
              Preventivas vs Corretivas
            </h2>
            <p className="text-gray-500 text-sm">
              Distribuição das manutenções concluídas.
            </p>
          </div>


        <div className="h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts.maintenanceTypes}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"  
                labelLine={false}
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name}: ${(percent! * 100).toFixed(1)}%`
                }
              >
                {charts.maintenanceTypes.map((_ : any, i : number) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [`${value} manutenções`, name]}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          </div>
        
        </div>

        {/* Custo Mensal */}
        <div className="col-span-1 lg:col-span-4 bg-white rounded-xl shadow-md p-4">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-gray-800 font-semibold text-lg">
              Custo Mensal (R$)
            </h2>
            <p className="text-gray-500 text-sm">
              Evolução mensal dos custos de manutenção.
            </p>
          </div>


       <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.monthlyCosts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

              <XAxis dataKey="month" tick={{ fill: "#4B5563", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#4B5563", fontSize: 12 }}
                tickFormatter={(v) =>
                  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
                }
              />

              <Tooltip
                formatter={(value: number) => formatterToCurrency(value)}
                labelFormatter={(label) => `Mês: ${label}`}
              />

              <Line
                type="monotone"
                dataKey="amount"
                name="Custo"
                stroke={LINE_COLOR}
                strokeWidth={3}
                dot={{ r: 4, fill: "#FFF", stroke: LINE_COLOR, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
 
        </div>
      </div>

      {/* Top Ativos */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="mb-4 border-b pb-2">
          <h2 className="text-gray-800 font-semibold text-lg">
            Ativos com mais Manutenções Corretivas
          </h2>
          <p className="text-gray-500 text-sm">
            Ranking dos ativos com maior incidência de problemas.
          </p>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={charts.topAssets}
            layout="vertical"
            margin={{ left: 60, right: 20, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={260} />

            <Tooltip
              formatter={(value) => [`${value} ocorrências`, "Quantidade"]}
            />

            <Legend
              formatter={(value) => (
                <span className="text-sm text-gray-700">{value}</span>
              )}
            />

            <Bar
              dataKey="count"
              name="Quantidade"
              fill="#3b82f6"
              barSize={18}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
