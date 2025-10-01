import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Percent, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useIndicators } from "./use-indicators";

export interface IndicatorsTabProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}
const COLORS = ["#4273fc", "#60a5fa", "#93c5fd", "#2563eb", "#1e40af"];

const receitaPercentual = [
  { name: "Salão de Festa", value: 42, color: "#3b82f6" },
  { name: "Salão Gourmet", value: 19, color: "#facc15" },
  { name: "Quadra", value: 14, color: "#a855f7" },
  { name: "Churrasqueira 1", value: 14, color: "#22c55e" },
  { name: "Churrasqueira 2", value: 12, color: "#f97316" },
];

const evolucaoData = [
  { mes: "Jan", ocupacao: 78, receita: 20000 },
  { mes: "Fev", ocupacao: 62, receita: 15000 },
  { mes: "Mar", ocupacao: 55, receita: 12000 },
  { mes: "Abr", ocupacao: 58, receita: 12500 },
  { mes: "Mai", ocupacao: 70, receita: 18000 },
  { mes: "Jun", ocupacao: 65, receita: 16000 },
  { mes: "Jul", ocupacao: 60, receita: 10000 },
];

export function IndicatorsTab({ date, setDate }: IndicatorsTabProps) {
  const [typePercentageChart, setTypePercentageChart] = useState<
    "percentage" | "amount"
  >("percentage");
  const {
    indicatorsCards,
    indicatorsStatus,
    bookingsChart,
    bookingsChartStatus,
    percentageByAreaChart,
    percentageByAreaChartStatus,
  } = useIndicators(date);

  return (
    <div className="flex flex-col gap-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <Card className="min-w-[210px]cursor-pointer">
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <CardTitle className="text-md dark:text-foreground">
                Reservas no Mês
              </CardTitle>
              <CalendarDays className="text-gray-700" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl md:text-3xl font-bold dark:text-foreground">
              {indicatorsCards?.totalBookingsMonth}
            </span>
          </CardContent>
        </Card>

        <Card className="min-w-[210px]  cursor-pointer">
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <CardTitle className="text-md dark:text-foreground">
                Receita Gerada
              </CardTitle>
              <DollarSign className="text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl md:text-3xl font-bold dark:text-foreground">
              {indicatorsCards?.totalRevenueMOnth.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </CardContent>
        </Card>

        <Card className="min-w-[210px] cursor-pointer">
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <CardTitle className="text-md dark:text-foreground">
                Taxa de Ocupação
              </CardTitle>
              <Percent className="text-gray-700" />
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-2xl md:text-3xl font-bold dark:text-foreground">
              {indicatorsCards?.totalOccupationMonth}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barras */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Áreas com Mais Reservas
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsChart} barSize={20}>
                <XAxis
                  dataKey="areaName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                    padding: "6px 10px",
                  }}
                  cursor={{ fill: "rgba(66,115,252,0.05)" }}
                />
                <Bar
                  dataKey="total"
                  fill="#4273fc"
                  radius={[4, 4, 0, 0]}
                  name="Reservas"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Percentual de Receita por Área</CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => setTypePercentageChart("amount")}
                className={`px-3 py-1 rounded transition-colors duration-200 cursor-pointer ${
                  typePercentageChart === "amount"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                R$
              </button>
              <button
                onClick={() => setTypePercentageChart("percentage")}
                className={`px-3 py-1 rounded transition-colors duration-200 cursor-pointer ${
                  typePercentageChart === "percentage"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                %
              </button>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={percentageByAreaChart}
                  dataKey={
                    typePercentageChart === "amount" ? "total" : "percentual"
                  } // alterna aqui
                  nameKey="areaName"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={3}
                >
                  {receitaPercentual.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                    padding: "6px 10px",
                  }}
                  formatter={(value, name) =>
                    typePercentageChart === "percentage"
                      ? [`${value}%`, name]
                      : [
                          value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }),
                          name,
                        ]
                  }
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Linha */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Ocupação e Receita (Anual)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={evolucaoData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              {/* Grid suave para referência visual */}
              <CartesianGrid
                stroke="#60a5fa"
                strokeDasharray="3 3"
                opacity={0.3}
              />

              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                  padding: "6px 10px",
                }}
                formatter={(value, name) => [
                  typeof value === "number"
                    ? value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : value,
                  name,
                ]}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="ocupacao"
                stroke={COLORS[1]} // cor neutra da paleta
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="receita"
                stroke={COLORS[3]} // outra cor neutra da paleta
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
