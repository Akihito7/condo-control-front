import { fetchDistruibitionByType } from "@/api/fetch-delinquency-distruibition-by-type";
import { fetchDelinquencyMonthlyEvolution } from "@/api/fetch-delinquency-monthly-evolution";
import { fetchDeliquencyRegistersAllPeriod } from "@/api/fetch-delinquency-registers-all-period";
import { fetchResumeDelinquency } from "@/api/fetch-resume-delinquency";
import { useUserContext } from "@/providers/use-user-context";
import { getFullMonthInterval } from "@/utils/get-full-month-interval";
import { useQuery } from "@tanstack/react-query";

interface UseIndicatorsProps {
  date: Date;
}
export function useIndicators({
  date
}: UseIndicatorsProps) {

  const {
    startDate,
    endDate
  } = getFullMonthInterval(date.toISOString());

  const { user } = useUserContext();
  const { condominiumId } = user;


  const { data: delinquencyResume, status: delinquencyResumeStatus } = useQuery({
    queryKey: [startDate, endDate, 'delinquency-resume'],
    queryFn: async () => fetchResumeDelinquency({
      startDate,
      endDate
    })
  })

  const { data: chartDistruibition, status: chartDistruibitionStatus } = useQuery({
    queryKey: [startDate, endDate, 'distruibition-type'],
    queryFn: async () => fetchDistruibitionByType({
      startDate,
      endDate,
    })
  })

  const { data: delinquencyMonthlyEvolution, status: delinquencyMonthlyEvolutionStatus } = useQuery({
    queryKey: [startDate, 'deliquency-monthly'],
    queryFn: () => fetchDelinquencyMonthlyEvolution(startDate),
  })


  const { data: delinquencyRegistersAllPeriod, status: delinquencyRegistersAllPeriodStatus } = useQuery({
    queryKey: ['delinquency-registers-all-period', condominiumId],
    queryFn: () => fetchDeliquencyRegistersAllPeriod({ condominiumId })
  })


  return {
    delinquencyResume,
    delinquencyResumeStatus,
    chartDistruibition,
    chartDistruibitionStatus,
    delinquencyMonthlyEvolution,
    delinquencyMonthlyEvolutionStatus,
    delinquencyRegistersAllPeriod,
    delinquencyRegistersAllPeriodStatus
  }
}