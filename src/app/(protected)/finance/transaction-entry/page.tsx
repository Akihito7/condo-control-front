"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DatePickRange } from "@/components/date-pick-ranger";
import { CardFinance } from "@/components/card-finance";
import {
  DollarSign,
  FileDown,
  Pencil,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ModalActionEntry } from "./modal-action-entry";
import { useTransaction } from "./use-transaction";
import Select, { MultiValue } from "react-select";
import { FinancialRecord } from "@/api/fetch-financial-records";
import { useUserContext } from "@/providers/use-user-context";
import { CardSkeleton } from "@/components/card-skeleton";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useIsMobile } from "@/lib/use-is-mobile";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { redirect } from "next/navigation";
import { userPagePermission } from "@/utils/user-page-permission";
import { MonthYearPicker } from "@/components/month-year-select";
import { printDocument } from "@/utils/print-document";
import { NotificationDropdown } from "@/components/notification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsTab } from "./tabs/transacations-tab";
import { IndicatorsTab } from "./tabs/indicators-tab";

export type OptionType = {
  value: number;
  label: string;
};

export default function Finance() {
  const { user } = useUserContext();

  const { read, edit } = userPagePermission({
    pageId: 1,
  });

  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [incomeExpenseOptionsSelected, setIncomeExpenseOptionSelected] =
    useState<MultiValue<OptionType>>([]);
  const componentMainRef = useRef<HTMLElement>(null);
  const componentFilterRef = useRef<HTMLDivElement>(null);

  const condominiumId = user.condominiumId;

  const isMobile = useIsMobile();

  const {
    transactions,
    categoriesOptions,
    incomeExpenseOptions,
    paymentMethodsOptions,
    apartments,
    paymentStatusOptions,
    cardsTransaction,
    handleDeleteRegister,
    cardsTransactionStatus,
    transactionsStatus,
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
  } = useTransaction({
    selectedDate,
    incomeExpenseOptionsSelected,
    condominiumId,
  });

  useEffect(() => {
    if (
      incomeExpenseOptions?.length &&
      incomeExpenseOptionsSelected?.length === 0
    ) {
      const defaultOptions = incomeExpenseOptions.map((option) => ({
        value: option.id,
        label: option.name,
      }));
      setIncomeExpenseOptionSelected(defaultOptions);
    }
  }, [incomeExpenseOptions]);

  const incomeExpenseSelectOptions: OptionType[] =
    incomeExpenseOptions?.map((option) => ({
      value: option.id,
      label: option.name,
    })) ?? [];

  return (
    <main
      ref={componentMainRef}
      className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-y-auto"
    >
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Finanças"]} />
          <div className="ml-auto">
            <NotificationDropdown />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral Financeira
        </h1>
      </div>

      <div
        ref={componentFilterRef}
        className={`flex flex-col gap-4 md:items-end md:flex-row`}
      >
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês e ano de referência
          </label>

          <MonthYearPicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            justFutureMonths={false}
          />
        </div>
        <div className="max-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de registros
          </label>
          <Select<OptionType, true>
            isMulti
            value={incomeExpenseOptionsSelected}
            onChange={(value) => {
              if (value.length === 0) return;
              setIncomeExpenseOptionSelected(value);
            }}
            options={incomeExpenseSelectOptions}
            placeholder="Selecione..."
          />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
          onClick={() => {
            if (!componentFilterRef.current || !componentMainRef.current)
              return;
            printDocument(componentMainRef.current, componentFilterRef.current);
          }}
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <Tabs defaultValue="transaction-entry">
        <TabsList className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <TabsTrigger
            value="transaction-entry"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Transações
          </TabsTrigger>
          <TabsTrigger
            value="indicators"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Indicadores
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="transaction-entry">
            <TransactionsTab
              apartments={apartments}
              cardsTransaction={cardsTransaction}
              cardsTransactionStatus={cardsTransactionStatus}
              categoriesOptions={categoriesOptions}
              edit={edit}
              handleDeleteRegister={handleDeleteRegister}
              incomeExpenseOptions={incomeExpenseOptions}
              isMobile={isMobile}
              paymentMethodsOptions={paymentMethodsOptions}
              paymentStatusOptions={paymentStatusOptions}
              selectedDate={selectedDate}
              transactions={transactions}
              transactionsStatus={transactionsStatus}
            />
          </TabsContent>

          <TabsContent value="indicators">
            <IndicatorsTab
              chartExpense={chartExpense}
              chartExpenseStatus={chartExpenseStatus}
              chartExpensiveFixedVsVariable={chartExpensiveFixedVsVariable}
              chartExpensiveFixedVsVariableStatus={
                chartExpensiveFixedVsVariableStatus
              }
              chartFinacialSummaryMonthlyBalance={
                chartFinacialSummaryMonthlyBalance
              }
              chartFinacialSummaryMonthlyBalanceStatus={
                chartFinacialSummaryMonthlyBalanceStatus
              }
              chartRevenue={chartRevenue}
              chartRevenueFixedVsVariable={chartRevenueFixedVsVariable}
              chartRevenueFixedVsVariableStatus={
                chartRevenueFixedVsVariableStatus
              }
              chartRevenueStatus={chartRevenueStatus}
            />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
