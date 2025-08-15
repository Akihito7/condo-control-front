"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePickRange } from "@/components/date-pick-ranger";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Label,
  Line,
} from "recharts";
import { useFinancialSummary } from "./use-financial-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";

const COLORS_INCOME = ["#4ade80", "#bbf7d0"];
const COLORS_EXPENSE = ["#f87171", "#fca5a5"];

export default function FinancialSummary() {
  const { read, edit } = userPagePermission({ pageId: 7 });

  if (!read) {
    redirect("/home");
  }

  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const {
    chartRevenue,
    chartRevenueStatus,
    chartExpense,
    chartExpenseStatus,
    chartRevenueFixedVsVariable,
    chartRevenueFixedVsVariableStatus,
    chartExpensiveFixedVsVariable,
    chartExpensiveFixedVsVariableStatus,
    chartFinacialSummaryMonthlyBalance,
    chartFinacialSummaryMonthlyBalanceStatus,
  } = useFinancialSummary({
    startDate: range.from,
    endDate: range.to,
  });

  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-x-auto">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Indicadores"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Resumo Financeiro
        </h1>
      </div>

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o período
          </label>
          <DatePickRange range={range} setRange={setRange} />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <section className="grid grid-cols-2 grid-rows-3 gap-2">
        <div className="w-full  bg-white rounded-xl shadow-md p-4">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-gray-800 font-semibold text-lg">
              Receitas por Categoria
            </h2>
            <p className="text-gray-500 text-sm">
              Visão geral das fontes de receita.
            </p>
          </div>

          <div className="w-full h-[80%]">
            {chartRevenueStatus === "pending" ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : chartRevenue && chartRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-25}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                    tickFormatter={(value) =>
                      `R$ ${value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 0,
                      })}`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `R$ ${value.toLocaleString("pt-BR")}`
                    }
                  />
                  <Bar
                    dataKey="value"
                    fill="#4ade80"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>

        <div className="w-full  bg-white rounded-xl shadow-md p-4">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-gray-800 font-semibold text-lg">
              Despesas por Categoria
            </h2>
            <p className="text-gray-500 text-sm">
              Visão geral das fontes de despesas.
            </p>
          </div>

          <div className="w-full h-[80%]">
            {chartExpenseStatus === "pending" ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : chartExpense && chartExpense.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartExpense}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-25}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                    tickFormatter={(value) =>
                      `R$ ${value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 0,
                      })}`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `R$ ${value.toLocaleString("pt-BR")}`
                    }
                  />
                  <Bar
                    dataKey="value"
                    fill="#f87171"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>

        <div className="w-full l bg-white rounded-xl shadow-md p-4">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-gray-800 font-semibold text-lg">
              Tipos de Receita
            </h2>
            <p className="text-gray-500 text-sm">
              Distribuição entre fixas e variáveis.
            </p>
          </div>

          <div className="h-[300px]">
            {chartRevenueFixedVsVariableStatus === "pending" ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : chartRevenueFixedVsVariable &&
              chartRevenueFixedVsVariable.length > 0 &&
              chartRevenueFixedVsVariable.every((item: any) => {
                if (item.value === null || undefined) {
                  return false;
                }
                return true;
              }) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartRevenueFixedVsVariable}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(1)}%`
                    }
                    labelLine={false}
                  >
                    {chartRevenueFixedVsVariable?.map(
                      (_: unknown, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS_INCOME[index]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`,
                      name,
                    ]}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>

        <div className="w-full  bg-white rounded-xl shadow-md p-4">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-gray-800 font-semibold text-lg">
              Tipos de despesas
            </h2>
            <p className="text-gray-500 text-sm">
              Distribuição entre fixas e variáveis.
            </p>
          </div>

          <div className="h-[300px]">
            {chartExpensiveFixedVsVariableStatus === "pending" ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : chartExpensiveFixedVsVariable &&
              chartExpensiveFixedVsVariable.length > 0 &&
              chartExpensiveFixedVsVariable.every((item: any) => {
                if (item.value === null || undefined) {
                  return false;
                }
                return true;
              }) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartExpensiveFixedVsVariable}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(1)}%`
                    }
                    labelLine={false}
                  >
                    {chartExpensiveFixedVsVariable?.map(
                      (_: unknown, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS_EXPENSE[index]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`,
                      name,
                    ]}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>

        <div className="w-full bg-white rounded-xl shadow-md p-4 mx-auto col-span-2">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-gray-800 font-semibold text-lg">
              Receitas vs Despesas com Evolução do Saldo
            </h2>
            <p className="text-gray-500 text-sm">
              Comparativo mensal de receitas e despesas com linha de evolução do
              saldo.
            </p>
          </div>

          <div className="h-[400px]">
            {chartFinacialSummaryMonthlyBalanceStatus === "pending" ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : chartFinacialSummaryMonthlyBalance &&
              chartFinacialSummaryMonthlyBalance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartFinacialSummaryMonthlyBalance}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => `R$ ${v / 1000}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(v) => `R$ ${v / 1000}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `R$ ${value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}`,
                      name,
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-sm text-gray-700">{value}</span>
                    )}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="income"
                    fill="#4ade80"
                    name="Receitas"
                    barSize={20}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="expense"
                    fill="#f87171"
                    name="Despesas"
                    barSize={20}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    name="Saldo"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#3b82f6" }}
                    activeDot={{ r: 7 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
