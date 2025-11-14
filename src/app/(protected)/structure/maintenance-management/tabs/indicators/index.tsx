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

  const { data: summary } = useQuery({
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

  // fallback cards & charts
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

  const totalMaintenances = cards.total;
  const percentPreventive =
    cards.total > 0
      ? ((cards.preventives / cards.total) * 100).toFixed(1)
      : "0.0";

  // Minimalist shadcn-like colors
  const PIE_COLORS = ["#10B981", "#F43F5E"]; // emerald, rose
  const LINE_COLOR = "#6366F1"; // indigo
  const GRID_COLOR = "#E4E4E7";
  const TOOLTIP_BG = "#F4F4F5";
  const TOOLTIP_FG = "#F4F4F5";
  const YAXIS_TICK = "#6B7280";

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
              <p className="text-lg font-semibold">{totalMaintenances}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">% de Preventivas</p>
              <p className="text-lg font-semibold text-emerald-600">
                {percentPreventive}%
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Custo Total</p>
              <p className="text-lg font-semibold text-primary">
                {formatterToCurrency(cards.totalAmount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Custo Médio</p>
              <p className="text-lg font-semibold text-muted-foreground">
                {formatterToCurrency(cards.averageAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Preventivas vs Corretivas (2) + Custo Mensal (4) */}
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
                    {charts.maintenanceTypes.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name) => [`${value}`, name]}
                    contentStyle={{
                      backgroundColor: TOOLTIP_BG,
                      borderRadius: 8,
                      border: "1px solid black",
                      color: TOOLTIP_FG,
                      padding: "10px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="square"
                    align="center"
                    formatter={(value) => (
                      <span style={{ color: "#444", fontSize: 14 }}>
                        {value}
                      </span>
                    )}
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
                <CartesianGrid strokeDasharray="4 4" stroke={GRID_COLOR} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: YAXIS_TICK, fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickFormatter={(value) =>
                    `R$ ${value.toLocaleString("pt-BR")}`
                  }
                  tick={{ fill: YAXIS_TICK, fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatterToCurrency(value)}
                  contentStyle={{
                    backgroundColor: TOOLTIP_BG,
                    borderRadius: 8,
                    border: "none",
                    color: TOOLTIP_FG,
                    padding: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={LINE_COLOR}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#FFF",
                    stroke: LINE_COLOR,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ativos com mais manutenções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Ativos com mais manutenções corretivas.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={charts.topAssets}
              layout="vertical"
              margin={{ left: 60, right: 20, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis
                type="number"
                tick={{ fill: YAXIS_TICK, fontSize: 12 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#374151" }}
                width={260}
              />
              <Tooltip
                formatter={(value: number) => [`${value}`, "Quantidade"]}
                contentStyle={{
                  backgroundColor: TOOLTIP_BG,
                  borderRadius: 8,
                  border: "none",
                  color: TOOLTIP_FG,
                  padding: "10px",
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                fill="#3B82F6" // blue-500
                barSize={18}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
