"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import React, { useEffect, useState } from "react";
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
import { userPermission } from "@/utils/user-permission";

export type OptionType = {
  value: number;
  label: string;
};

export default function Finance() {
  const { read, edit } = userPermission({ pageId: 1 });
  if (!read) {
    redirect("/home");
  }

  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [incomeExpenseOptionsSelected, setIncomeExpenseOptionSelected] =
    useState<MultiValue<OptionType>>([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [transactionSelected, setTransacationSelected] = useState<
    FinancialRecord | undefined
  >();
  const { user } = useUserContext();
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
  } = useTransaction({
    startDate: range.from,
    endDate: range.to,
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
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Finanças"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral Financeira
        </h1>
      </div>

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o período
          </label>
          <DatePickRange range={range} setRange={setRange} />
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
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {cardsTransactionStatus === "pending" ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </>
        ) : cardsTransactionStatus === "success" ? (
          isMobile ? (
            <>
              <Swiper className="w-full" spaceBetween={16} slidesPerView={1.2}>
                <SwiperSlide>
                  <CardFinance
                    title="Receita Total"
                    type="income"
                    value={cardsTransaction?.totalIncome ?? 0}
                    target={cardsTransaction?.incomeTarget}
                    icon={<TrendingUp color="#22c55e" />}
                    isSameMonth={cardsTransaction?.isSameMonth ?? false}
                    date={range.from}
                  />
                </SwiperSlide>

                <SwiperSlide>
                  <CardFinance
                    title="Despesas Totais"
                    value={cardsTransaction?.totalExpenses ?? 0}
                    target={cardsTransaction?.expensesTarget}
                    icon={<TrendingDown color="#ef4444" />}
                    type="expensive"
                    isSameMonth={cardsTransaction?.isSameMonth ?? false}
                    date={range.from}
                  />
                </SwiperSlide>

                <SwiperSlide>
                  <CardFinance
                    title="Saldo"
                    value={cardsTransaction?.balance ?? 0}
                    target={cardsTransaction?.incomeTarget}
                    isSameMonth={cardsTransaction?.isSameMonth ?? false}
                    icon={
                      <DollarSign
                        color={
                          cardsTransaction
                            ? cardsTransaction.balance > 0
                              ? "#22c55e"
                              : "#ef4444"
                            : "#22c55e"
                        }
                      />
                    }
                    date={range.from}
                  />
                </SwiperSlide>
              </Swiper>
            </>
          ) : (
            <>
              <CardFinance
                title="Receita Total"
                type="income"
                value={cardsTransaction?.totalIncome ?? 0}
                target={cardsTransaction?.incomeTarget}
                icon={<TrendingUp color="#22c55e" />}
                isSameMonth={cardsTransaction?.isSameMonth ?? false}
                date={range.from}
              />

              <CardFinance
                title="Despesas Totais"
                value={cardsTransaction?.totalExpenses ?? 0}
                target={cardsTransaction?.expensesTarget}
                icon={<TrendingDown color="#ef4444" />}
                type="expensive"
                isSameMonth={cardsTransaction?.isSameMonth ?? false}
                date={range.from}
              />

              <CardFinance
                title="Saldo"
                value={cardsTransaction?.balance ?? 0}
                target={cardsTransaction?.incomeTarget}
                isSameMonth={cardsTransaction?.isSameMonth ?? false}
                icon={
                  <DollarSign
                    color={
                      cardsTransaction
                        ? cardsTransaction.balance > 0
                          ? "#22c55e"
                          : "#ef4444"
                        : "#22c55e"
                    }
                  />
                }
                date={range.from}
              />
            </>
          )
        ) : (
          <div className="col-span-3 text-center text-sm text-red-500">
            Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.
          </div>
        )}
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800  text-md md:text-lg">
            Transações Recentes
          </h2>
          {Array.isArray(categoriesOptions) &&
            Array.isArray(incomeExpenseOptions) &&
            Array.isArray(paymentMethodsOptions) &&
            Array.isArray(apartments) &&
            Array.isArray(paymentStatusOptions) && (
              <ModalActionEntry
                categoriesOptions={categoriesOptions}
                incomeExpenseOptions={incomeExpenseOptions}
                paymentMethodsOptions={paymentMethodsOptions}
                apartments={apartments}
                paymentStatusOptions={paymentStatusOptions}
                type={transactionSelected?.id ? "edit" : "create"}
                isOpen={modalIsOpen}
                setIsOpen={setModalIsOpen}
                setTransacationSelected={setTransacationSelected}
                transactionSelected={transactionSelected}
                condominiumId={condominiumId}
                userCanManage={edit}
              />
            )}
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead className="w-[20%]">Data de vencimento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Recorrente</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Valor</TableHead>
                <TableHead>Data do Pagamento</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactionsStatus === "pending" ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                <>
                  {transactions?.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.dueDate}
                      </TableCell>
                      <TableCell className="capitalize text-sm">
                        {transaction.incomeExpenseTypeId === 4
                          ? "Receita"
                          : "Despesa"}
                      </TableCell>
                      <TableCell>{transaction.categoryName}</TableCell>
                      <TableCell className="text-center">
                        {transaction.apartmentNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.recordTypeId === 1 ? "Fixo" : "Variável"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.isRecurring ? "Sim" : "Não"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.paymentMethodName ?? "-"}
                      </TableCell>

                      <TableCell>
                        {transaction.paymentStatusName ?? "-"}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-sm">
                        {transaction.amount.toLocaleString("pt-BR", {
                          currency: "BRL",
                          style: "currency",
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction.paymentDate ?? "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction.amountPaid?.toLocaleString("pt-BR", {
                          currency: "BRL",
                          style: "currency",
                        }) ?? "-"}
                      </TableCell>
                      <TableCell>{transaction.observation}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                            <Pencil className="w-4 h-4 text-gray-700" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setTransacationSelected(transaction);
                                setModalIsOpen(true);
                              }}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteRegister(transaction.id)
                              }
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
