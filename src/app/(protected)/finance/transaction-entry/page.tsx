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
import { Button } from "@/components/ui/button";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DatePickRange } from "@/components/date-pick-ranger";
import { CardFinance } from "@/components/card-finance";
import {
  DollarSign,
  FileDown,
  Pencil,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ModalActionEntry } from "./modal-action-entry";
import { useTransaction } from "./use-transaction";
import Select, { MultiValue } from "react-select";
import { FinancialRecord } from "@/api/fetch-financial-records";
import { useUserContext } from "@/providers/use-user-context";

export type OptionType = {
  value: number;
  label: string;
};

export default function Finance() {
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

  const {
    transactions,
    categoriesOptions,
    incomeExpenseOptions,
    paymentMethodsOptions,
    apartments,
    paymentStatusOptions,
    cardsTransaction,
    cardsTransactionIsLoading,
    handleDeleteRegister,
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
    <main className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <Breadcrumb paths={["Início", "Finanças"]} />
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral Financeira
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o período
          </label>
          <DatePickRange range={range} setRange={setRange} />
        </div>

        <div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardFinance
          title="Receita Total"
          value={cardsTransaction?.totalIncome ?? 0}
          percentage={20}
          icon={<TrendingUp color="#22c55e" />}
          isLoading={cardsTransactionIsLoading}
        />

        <CardFinance
          title="Despesas Totais"
          value={cardsTransaction?.totalExpenses ?? 0}
          percentage={90}
          icon={<TrendingDown color="#ef4444" />}
          type="expensive"
          isLoading={cardsTransactionIsLoading}
        />

        <CardFinance
          title="Saldo"
          value={cardsTransaction?.balance ?? 0}
          percentage={40}
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
          type={
            cardsTransaction
              ? cardsTransaction.balance > 0
                ? "revenue"
                : "expensive"
              : "revenue"
          }
          isLoading={cardsTransactionIsLoading}
        />
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
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
              />
            )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Data de vencimento</TableHead>
              <TableHead>Tipo Receita/Despesa</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Apartamento</TableHead>
              <TableHead>Tipo Fixo/Variável</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Data do Pagamento</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.dueDate}
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {transaction.categoryTypeName === "income"
                    ? "Receita"
                    : "Despesa"}
                </TableCell>
                <TableCell>{transaction.categoryName}</TableCell>
                <TableCell className="text-center">
                  {transaction.apartmentNumber}
                </TableCell>
                <TableCell className="text-sm">
                  {transaction.isRecurring ? "Fixo" : "Variável"}
                </TableCell>
                <TableCell className="text-sm">
                  {transaction.paymentMethodName ?? "-"}
                </TableCell>
                <TableCell>{transaction.paymentStatusName ?? "-"}</TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {transaction.categoryTypeName === "income" ? "+" : "-"}$
                  {transaction.amount.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-center">
                  {transaction.paymentDate ?? "-"}
                </TableCell>
                <TableCell>{transaction.observation}</TableCell>
                <TableCell>
                  <button
                    aria-label="Editar"
                    className="p-1 rounded hover:bg-gray-200"
                    onClick={() => {
                      setTransacationSelected(transaction);
                      setModalIsOpen(true);
                    }}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    aria-label="Deletar"
                    className="p-1 rounded hover:bg-gray-200 ml-2"
                    onClick={() => handleDeleteRegister(transaction.id)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
