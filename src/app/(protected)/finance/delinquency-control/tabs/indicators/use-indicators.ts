import { fetchDistruibitionByType } from "@/api/fetch-delinquency-distruibition-by-type";
import { fetchDelinquencyMonthlyEvolution } from "@/api/fetch-delinquency-monthly-evolution";
import { fetchResumeDelinquency } from "@/api/fetch-resume-delinquency";
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


  return {
    delinquencyResume,
    delinquencyResumeStatus,
    chartDistruibition,
    chartDistruibitionStatus,
    delinquencyMonthlyEvolution,
    delinquencyMonthlyEvolutionStatus
  }
}