import { deleteRegister } from "@/api/delete-register";
import { fetchCategoriesOptions } from "@/api/fecth-categories-options";
import { fetchApartments } from "@/api/fetch-apartments";
import { fetchCardsTransactionEntry } from "@/api/fetch-cards-transaction-entry";
import { fetchFinancialRecords } from "@/api/fetch-financial-records";
import { fetchIncomeExpenseOptions } from "@/api/fetch-income-expense-options";
import { fetchPaymentMethodOptions } from "@/api/fetch-payment-method.options";
import { fetchPaymentStatusOptions } from "@/api/fetch-payment-status.options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MultiValue } from "react-select";
import { OptionType } from "./page";
import { format } from "date-fns";
import { getFullMonthInterval } from "@/utils/get-full-month-interval";
import { fetchChartRevenueByCategory } from "@/api/fetch-chart-revenue-by-category";
import { fetchChartExpenseByCategory } from "@/api/fetch-chart-expense-by-category";
import { fetchChartRevenueFixedVsVariable } from "@/api/fetch-chart-revenue-fixed-vs-variable";
import { fetchChartExpensiveFixedVsVariable } from "@/api/fetch-chart-expensive-fixed-vs-variable";
import { fetchFinancialSummaryMonthlyBalance } from "@/api/fetch-financial-summary-monthly-balance";

interface UseTransactionProps {
  selectedDate: Date;
  incomeExpenseOptionsSelected: MultiValue<OptionType>;
  condominiumId: number;
}
export function useTransaction({
  selectedDate,
  incomeExpenseOptionsSelected,
  condominiumId,
}: UseTransactionProps) {
  const queryClient = useQueryClient();
  const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");
  const { startDate, endDate } = getFullMonthInterval(selectedDateFormatted);

  const year = format(selectedDate, "yyyy");

  const incomeExpenseOptionsSelectedId = incomeExpenseOptionsSelected?.map(
    (option: any) => option.value,
  );
  const {
    data: transactions,
    error: errorTransactions,
    status: transactionsStatus,
  } = useQuery({
    queryKey: [
      "transactions",
      selectedDateFormatted,
      incomeExpenseOptionsSelected,
      condominiumId,
    ],
    queryFn: () =>
      fetchFinancialRecords({
        condominiumId,
        selectedDate: selectedDateFormatted,
        incomeExpenseOptionsSelectedId,
      }),
    enabled: incomeExpenseOptionsSelectedId
      ? incomeExpenseOptionsSelectedId.length > 0 && !!condominiumId
      : false,
  });

  const { data: categoriesOptions, error: erorrCategoriesOptions } = useQuery({
    queryKey: ["categoriesOptions"],
    queryFn: fetchCategoriesOptions,
  });

  const { data: incomeExpenseOptions, error: errorIncomeExpenseOptions } =
    useQuery({
      queryKey: ["incomeExpenseOptions"],
      queryFn: fetchIncomeExpenseOptions,
    });

  const { data: paymentMethodsOptions, error: errorPaymentMethodsOptions } =
    useQuery({
      queryKey: ["paymentsMethodsOptions"],
      queryFn: fetchPaymentMethodOptions,
    });

  const { data: apartments, error: errorApartments } = useQuery({
    queryKey: ["apartments"],
    queryFn: async () => fetchApartments({ condominiumId }),
  });

  const { data: paymentStatusOptions, error: errorPaymentStatus } = useQuery({
    queryKey: ["payment-status"],
    queryFn: fetchPaymentStatusOptions,
  });

  const {
    data: cardsTransaction,
    isLoading: cardsTransactionIsLoading,
    status: cardsTransactionStatus,
  } = useQuery({
    queryKey: ["revenueTotal", startDate, endDate, condominiumId],
    queryFn: async () =>
      fetchCardsTransactionEntry({
        condominiumId,
        startDate,
        endDate,
      }),
    enabled: !!condominiumId,
  });

  const { mutateAsync: handleDeleteRegister } = useMutation({
    mutationFn: (registerId: number) => deleteRegister({ registerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["revenueTotal"],
        exact: false,
      });
    },
  });

  const { data: chartRevenue, status: chartRevenueStatus } = useQuery({
    queryKey: ["chart-revenue", startDate, endDate],
    queryFn: async () =>
      fetchChartRevenueByCategory({
        condominiumId,
        startDate: startDate,
        endDate: endDate,
      }),
  });

  const { data: chartExpense, status: chartExpenseStatus } = useQuery({
    queryKey: ["chart", "chart-expense", startDate, endDate],
    queryFn: async () =>
      fetchChartExpenseByCategory({
        condominiumId,
        startDate: startDate,
        endDate: endDate,
      }),
  });

  const {
    data: chartRevenueFixedVsVariable,
    status: chartRevenueFixedVsVariableStatus,
  } = useQuery({
    queryKey: ["chart", "chart-revenue-fixed-variable", startDate, endDate],
    queryFn: async () =>
      fetchChartRevenueFixedVsVariable({
        condominiumId,
        startDate: startDate,
        endDate: endDate,
      }),
  });

  const {
    data: chartExpensiveFixedVsVariable,
    status: chartExpensiveFixedVsVariableStatus,
  } = useQuery({
    queryKey: ["chart", "chart-expensive-fixed-variable", startDate, endDate],
    queryFn: async () =>
      fetchChartExpensiveFixedVsVariable({
        condominiumId,
        startDate: startDate,
        endDate: endDate,
      }),
  });

  const {
    data: chartFinacialSummaryMonthlyBalance,
    status: chartFinacialSummaryMonthlyBalanceStatus,
  } = useQuery({
    queryKey: ["chart", "chart-financial-summary-monthly-balance", year],
    queryFn: async () =>
      fetchFinancialSummaryMonthlyBalance({
        condominiumId,
        year,
      }),
  });

  return {
    transactions,
    errorTransactions,
    categoriesOptions,
    erorrCategoriesOptions,
    incomeExpenseOptions,
    errorIncomeExpenseOptions,
    paymentMethodsOptions,
    errorPaymentMethodsOptions,
    apartments,
    errorApartments,
    paymentStatusOptions,
    errorPaymentStatus,
    cardsTransaction,
    cardsTransactionIsLoading,
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
  };
}
