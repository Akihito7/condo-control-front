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
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CardFinance } from "@/components/card-finance";
import { DollarSign, Pencil, TrendingDown, TrendingUp } from "lucide-react";

import { CardSkeleton } from "@/components/card-skeleton";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FinancialRecord } from "@/api/fetch-financial-records";
import { ModalActionEntry } from "../modal-action-entry";
import { useUserContext } from "@/providers/use-user-context";
import { CategoryType } from "@/api/fecth-categories-options";
import { IncomeExpense } from "@/api/fetch-income-expense-options";
import { PaymentMethod } from "@/api/fetch-payment-method.options";
import { ApartmentWithBlock } from "@/api/fetch-apartments";
import { PaymentStatus } from "@/api/fetch-payment-status.options";
import { FetchCardsTransactionEntryResponse } from "@/api/fetch-cards-transaction-entry";
import { Cards } from "../cards";

interface TransactionsTabProps {
  cardsTransaction: FetchCardsTransactionEntryResponse | undefined;
  isMobile: boolean;
  cardsTransactionStatus: "pending" | "error" | "success";
  selectedDate: Date;
  transactionsStatus: "pending" | "error" | "success";
  transactions: FinancialRecord[] | undefined;
  categoriesOptions: CategoryType[] | undefined;
  incomeExpenseOptions: IncomeExpense[] | undefined;
  paymentMethodsOptions: PaymentMethod[] | undefined;
  apartments: ApartmentWithBlock[] | undefined;
  paymentStatusOptions: PaymentStatus[] | undefined;
  handleDeleteRegister: (registerId: number) => Promise<void>;
  edit: boolean;
}

export function TransactionsTab({
  cardsTransaction,
  cardsTransactionStatus,
  isMobile,
  selectedDate,
  transactionsStatus,
  transactions,
  apartments,
  categoriesOptions,
  handleDeleteRegister,
  incomeExpenseOptions,
  paymentMethodsOptions,
  paymentStatusOptions,
  edit,
}: TransactionsTabProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] = useState<
    number | undefined
  >();
  const [transactionSelected, setTransacationSelected] = useState<
    FinancialRecord | undefined
  >();

  const { user } = useUserContext();
  const { condominiumId } = user;

  return (
    <div className="space-y-6">
      <Cards
        cardsTransaction={cardsTransaction}
        cardsTransactionStatus={cardsTransactionStatus}
        isMobile={isMobile}
        selectedDate={selectedDate}
      />

      <section
        className="rounded-xl overflow-auto border"
        style={{
          minHeight: isMobile ? "80vh" : "",
        }}
      >
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
                date={selectedDate}
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

        <div
          className=" border overflow-y-auto border-gray-300 rounded"
          style={{
            minHeight: isMobile ? "80vh" : "",
          }}
        >
          <Table className="min-w-full border-collapse overflow-y-auto">
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
                  {transactions?.map((transaction: any) => (
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
                        <DropdownMenu
                          open={
                            dropdownOpen &&
                            dropdownOpenToThisItem === transaction.id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setDropdownOpenToThisItem(undefined);
                            } else {
                              setDropdownOpenToThisItem(transaction.id);
                            }
                            setDropdownOpen(open);
                          }}
                        >
                          <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                            <Pencil className="w-4 h-4 text-gray-700" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setDropdownOpen(false);
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
    </div>
  );
}
