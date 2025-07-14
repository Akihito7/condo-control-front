"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  PiggyBank,
  FileDown,
} from "lucide-react";
import { CardProjection } from "./card-projection";
import { MonthYearPicker } from "@/components/month-year-select";
import { useProjection } from "./use-projection";
import { CardSkeleton } from "@/components/card-skeleton";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useIsMobile } from "@/lib/use-is-mobile";

export default function FinancialForecast() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    cardsProjection,
    cardsProjectionStatus,
    registersProjection,
    registersProjectionStatus,
  } = useProjection({
    selectedDate,
  });

  const dateFormatted = format(selectedDate, "MMMM/yyyy", { locale: ptBR });

  const isMobile = useIsMobile();

  return (
    <div className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Finanças"]} />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">
          Previsões Financeiras
        </h1>
      </div>

      <div className="flex flex-row gap-4 items-end">
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês de referência
          </label>
          <MonthYearPicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            justFutureMonths={true}
          />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsProjectionStatus === "pending" ? (
          <>
            {Array.from({ length: 4 }).map(() => (
              <CardSkeleton className="px-4 py-1" />
            ))}
          </>
        ) : isMobile ? (
          <>
            <Swiper className="w-full" spaceBetween={16} slidesPerView={1.2}>
              <SwiperSlide>
                <CardProjection
                  title="Receitas Projetadas"
                  amount={cardsProjection?.incomesTotal ?? 0}
                  icon={<TrendingUp color="#22c55e" />}
                />
              </SwiperSlide>

              <SwiperSlide>
                <CardProjection
                  title="Despesas Projetadas"
                  amount={cardsProjection?.expensesTotal ?? 0}
                  icon={<TrendingDown color="#ef4444" />}
                />
              </SwiperSlide>

              <SwiperSlide>
                <CardProjection
                  title="Saldo Projetado Mês"
                  amount={cardsProjection?.balance ?? 0}
                  icon={<DollarSign color="#2768bd" />}
                />
              </SwiperSlide>
              <SwiperSlide>
                <CardProjection
                  title="Saldo Projetado Total"
                  amount={cardsProjection?.balanceAccumulated ?? 0}
                  icon={<PiggyBank color="#9f22c5" />}
                />
              </SwiperSlide>
            </Swiper>
          </>
        ) : (
          <>
            <CardProjection
              title="Receitas Projetadas"
              amount={cardsProjection?.incomesTotal ?? 0}
              icon={<TrendingUp color="#22c55e" />}
            />
            <CardProjection
              title="Despesas Projetadas"
              amount={cardsProjection?.expensesTotal ?? 0}
              icon={<TrendingDown color="#ef4444" />}
            />
            <CardProjection
              title="Saldo Projetado Mês"
              amount={cardsProjection?.balance ?? 0}
              icon={<DollarSign color="#2768bd" />}
            />
            <CardProjection
              title="Saldo Projetado Total"
              amount={cardsProjection?.balanceAccumulated ?? 0}
              icon={<PiggyBank color="#9f22c5" />}
            />{" "}
          </>
        )}
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Detalhes da Projeção
          </h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead className="w-[50%]">Mês</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor Projetado</TableHead>
              </TableRow>
            </TableHeader>

            {registersProjectionStatus === "pending" ? (
              <>
                {Array.from({ length: 5 }).map(() => (
                  <TableRowSkeleton />
                ))}
              </>
            ) : (
              <TableBody>
                {registersProjection &&
                  registersProjection.map((projectionRegister) => (
                    <TableRow key={projectionRegister.id}>
                      <TableCell className="font-medium">
                        {dateFormatted}
                      </TableCell>
                      <TableCell className="capitalize text-sm">
                        {projectionRegister.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {projectionRegister.type}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">
                        {projectionRegister.total.toLocaleString("pt-br", {
                          currency: "BRL",
                          style: "currency",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </div>
      </section>
    </div>
  );
}
