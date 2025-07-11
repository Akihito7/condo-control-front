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



interface UseTransactionProps {
  startDate: Date;
  endDate: Date
  incomeExpenseOptionsSelected: MultiValue<OptionType>
  condominiumId: number
}
export function useTransaction({ startDate, endDate, incomeExpenseOptionsSelected, condominiumId }: UseTransactionProps) {

  const queryClient = useQueryClient()
  const startDateFormmated = startDate.toISOString().slice(0, 10);
  const endDateFormmated = endDate.toISOString().slice(0, 10);

  const incomeExpenseOptionsSelectedId = incomeExpenseOptionsSelected?.map((option: any) => option.value)
  const { data: transactions, error: errorTransactions, status: transactionsStatus } = useQuery({
    queryKey: ["transactions", startDate, endDate, incomeExpenseOptionsSelected, condominiumId],
    queryFn: () => fetchFinancialRecords({ condominiumId, startDate: startDateFormmated, endDate: endDateFormmated, incomeExpenseOptionsSelectedId }),
    enabled: incomeExpenseOptionsSelectedId ? incomeExpenseOptionsSelectedId.length > 0 && !!condominiumId : false
  });

  const { data: categoriesOptions, error: erorrCategoriesOptions } = useQuery({
    queryKey: ['categoriesOptions'],
    queryFn: fetchCategoriesOptions
  })

  const { data: incomeExpenseOptions, error: errorIncomeExpenseOptions } = useQuery({
    queryKey: ['incomeExpenseOptions'],
    queryFn: fetchIncomeExpenseOptions
  })

  const { data: paymentMethodsOptions, error: errorPaymentMethodsOptions } = useQuery({
    queryKey: ['paymentsMethodsOptions'],
    queryFn: fetchPaymentMethodOptions
  })

  const { data: apartments, error: errorApartments } = useQuery({
    queryKey: ['apartments'],
    queryFn: async () => fetchApartments({ condominiumId })
  })

  const { data: paymentStatusOptions, error: errorPaymentStatus } = useQuery({
    queryKey: ['payment-status'],
    queryFn: fetchPaymentStatusOptions
  })

  const { data: cardsTransaction, isLoading: cardsTransactionIsLoading, status: cardsTransactionStatus } = useQuery({
    queryKey: ['revenueTotal', startDate, endDate, condominiumId],
    queryFn: async () => fetchCardsTransactionEntry({
      condominiumId,
      startDate: startDateFormmated,
      endDate: endDateFormmated
    }),
    enabled: !!condominiumId
  })

  const { mutateAsync: handleDeleteRegister } = useMutation({
    mutationFn: (registerId: number) => deleteRegister({ registerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactions', startDate, endDate, incomeExpenseOptionsSelected, condominiumId],
      });
      queryClient.invalidateQueries({
        queryKey: ['revenueTotal', startDate, endDate, condominiumId],
      });
    }
  })

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
    transactionsStatus
  }
}
