"use client";

import React from "react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CardFinance } from "@/components/card-finance";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

import { CardSkeleton } from "@/components/card-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FetchCardsTransactionEntryResponse } from "@/api/fetch-cards-transaction-entry";

interface CardProps {
  cardsTransaction: FetchCardsTransactionEntryResponse | undefined;
  isMobile: boolean;
  cardsTransactionStatus: "pending" | "error" | "success";
  selectedDate: Date;
}

export function Cards({
  cardsTransaction,
  cardsTransactionStatus,
  selectedDate,
  isMobile,
}: CardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      {cardsTransactionStatus === "pending" ? (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
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
                  date={selectedDate}
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
                  date={selectedDate}
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
                  date={selectedDate}
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
              date={selectedDate}
            />

            <CardFinance
              title="Despesas Totais"
              value={cardsTransaction?.totalExpenses ?? 0}
              target={cardsTransaction?.expensesTarget}
              icon={<TrendingDown color="#ef4444" />}
              type="expensive"
              isSameMonth={cardsTransaction?.isSameMonth ?? false}
              date={selectedDate}
            />

            <CardFinance
              title="Saldo"
              value={cardsTransaction?.balance ?? 0}
              target={undefined}
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
              date={selectedDate}
            />

            <CardFinance
              title="Saldo Acumulado"
              value={cardsTransaction?.accumulatedBalance ?? 0}
              target={undefined}
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
              date={selectedDate}
            />
          </>
        )
      ) : (
        <div className="col-span-3 text-center text-sm text-red-500">
          Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.
        </div>
      )}
    </div>
  );
}
