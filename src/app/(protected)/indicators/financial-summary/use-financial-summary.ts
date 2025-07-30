import { fetchChartExpenseByCategory } from "@/api/fetch-chart-expense-by-category";
import { fetchChartExpensiveFixedVsVariable } from "@/api/fetch-chart-expensive-fixed-vs-variable";
import { fetchChartRevenueByCategory } from "@/api/fetch-chart-revenue-by-category";
import { fetchChartRevenueFixedVsVariable } from "@/api/fetch-chart-revenue-fixed-vs-variable";
import { fetchFinancialSummaryMonthlyBalance } from "@/api/fetch-financial-summary-monthly-balance";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';

interface UseFinancialSummaryProps {
  startDate: Date;
  endDate: Date;
}

export function useFinancialSummary({
  startDate,
  endDate
}: UseFinancialSummaryProps) {
  const {
    user
  } = useUserContext();
  const startDateFormmated = format(startDate, 'yyyy-MM-dd');
  const endDateFormmated = format(endDate, 'yyyy-MM-dd');
  const year = format(startDate, 'yyyy')
  const condominiumId = user.condominiumId;


  const { data: chartRevenue, status: chartRevenueStatus } = useQuery({
    queryKey: ['chart-revenue', startDateFormmated, endDateFormmated],
    queryFn: async () => fetchChartRevenueByCategory({
      condominiumId,
      startDate: startDateFormmated,
      endDate: endDateFormmated
    })
  })



  const { data: chartExpense, status: chartExpenseStatus } = useQuery({
    queryKey: ['chart-expense', startDateFormmated, endDateFormmated],
    queryFn: async () => fetchChartExpenseByCategory({
      condominiumId,
      startDate: startDateFormmated,
      endDate: endDateFormmated
    })
  })


  const { data: chartRevenueFixedVsVariable, status: chartRevenueFixedVsVariableStatus } = useQuery({
    queryKey: ['chart-revenue-fixed-variable', startDateFormmated, endDateFormmated],
    queryFn: async () => fetchChartRevenueFixedVsVariable({
      condominiumId,
      startDate: startDateFormmated,
      endDate: endDateFormmated
    })
  })

  const { data: chartExpensiveFixedVsVariable, status: chartExpensiveFixedVsVariableStatus } = useQuery({
    queryKey: ['chart-expensive-fixed-variable', startDateFormmated, endDateFormmated],
    queryFn: async () => fetchChartExpensiveFixedVsVariable({
      condominiumId,
      startDate: startDateFormmated,
      endDate: endDateFormmated
    })
  })

  const { data: chartFinacialSummaryMonthlyBalance, status: chartFinacialSummaryMonthlyBalanceStatus } = useQuery({
    queryKey: ['chart-financial-summary-monthly-balance', year],
    queryFn: async () => fetchFinancialSummaryMonthlyBalance({
      condominiumId,
      year
    })
  })

  return {
    chartRevenue,
    chartRevenueStatus,
    chartExpense,
    chartExpenseStatus,
    chartRevenueFixedVsVariable,
    chartRevenueFixedVsVariableStatus,
    chartExpensiveFixedVsVariable,
    chartExpensiveFixedVsVariableStatus,
    chartFinacialSummaryMonthlyBalance,
    chartFinacialSummaryMonthlyBalanceStatus
  }

}