"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

export function Indicators() {
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const { data: summary, status: summaryStatus } = useQuery({
    queryKey: ["summary", year],
    queryFn: () => fetchSummaryMaintenance(year),
    enabled: !!year,
  });

  const formatterToCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Fallback para evitar erro antes do carregamento
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
  };

  const totalMaintenances = cards.total;
  const percentPreventive =
    cards.total > 0 ? ((cards.preventives / cards.total) * 100).toFixed(1) : 0;

  const COLORS = ["#3B82F6", "#EF4444"];

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
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </Button>
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Resumo de Manutenções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Total de Manutenções
              </p>
              <p className="text-lg font-bold">{totalMaintenances}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">% de Preventivas</p>
              <p className="text-lg font-bold text-green-600">
                {percentPreventive}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custo Total</p>
              <p className="text-lg font-bold text-purple-600">
                {formatterToCurrency(cards.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custo Médio</p>
              <p className="text-lg font-bold text-blue-600">
                {formatterToCurrency(cards.averageAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Preventivas vs Corretivas (2 col) + Custo Mensal (4 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Preventivas vs Corretivas */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Preventivas vs. Corretivas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={charts.maintenanceTypes}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={60}
                    outerRadius={90}
                    label
                  >
                    {charts.maintenanceTypes.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name) => [`${value}`, name]}
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderRadius: 8,
                      border: "none",
                      color: "#FFFFFF",
                      padding: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Custo Mensal */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Custo Mensal (R$)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.monthlyCosts}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickFormatter={(value) =>
                    `R$ ${value.toLocaleString("pt-BR")}`
                  }
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatterToCurrency(value)}
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderRadius: 8,
                    border: "none",
                    color: "#FFFFFF",
                    padding: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#FFF",
                    stroke: "#6366F1",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
