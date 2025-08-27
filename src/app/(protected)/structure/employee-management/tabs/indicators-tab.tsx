import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export function IndicatorsTab() {
  const data = [
    { name: "Portaria", value: 12 },
    { name: "Limpeza", value: 18 },
    { name: "Manutenção", value: 5 },
    { name: "Administração", value: 9 },
    { name: "Jardinagem", value: 9 },
  ];

  // paleta suave, neutra mas elegante
  const COLORS = ["#4273fc", "#60a5fa", "#93c5fd", "#2563eb", "#1e40af"];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <Card className="cursor-pointer">
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <CardTitle className="text-md dark:text-foreground">
                Total de funcionários
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-bold dark:text-foreground">7</span>
          </CardContent>
        </Card>

        <Card className="cursor-pointer">
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <CardTitle className="text-md dark:text-foreground">
                Custo total de funcionários
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-bold dark:text-foreground">
              R$ 17.700,00
            </span>
          </CardContent>
        </Card>
      </div>

      <section className="mt-8 overflow-y-auto h-full">
        <div className="flex gap-4">
          {/* gráfico de barras */}
          <div className="min-w-[500px] w-[49.5%] h-[450px] shadow-lg rounded-xl p-4 flex flex-col">
            <span className="block text-gray-800 text-lg font-medium mb-4">
              Funcionários por Área
            </span>
            <div className="h-[0.1px] w-full bg-gray-300 mb-4" />
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={20}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
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
                    dataKey="value"
                    fill="#4273fc"
                    radius={[4, 4, 0, 0]}
                    name="Quantidade"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* gráfico de pizza */}
          <div className="min-w-[500px] w-[49.5%] h-[450px] shadow-lg rounded-xl p-4 flex flex-col">
            <span className="block text-gray-800 text-lg font-medium mb-4">
              Gastos por Área
            </span>
            <div className="h-[0.1px] w-full bg-gray-300 mb-4" />
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                  >
                    {data.map((entry, index) => (
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
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
