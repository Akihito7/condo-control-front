import { fetchDistruibitionByType } from "@/api/fetch-delinquency-distruibition-by-type";
import { fetchDeliquencyRegisters } from "@/api/fetch-delinquency-registers";
import { fetchResumeDelinquency } from "@/api/fetch-resume-delinquency";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useIndicators() {
  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const startDateFormatted = format(range.from, 'yyyy-MM-dd');
  const endDateFormatted = format(range.to, 'yyyy-MM-dd');

  const { data: delinquencyResume, status: delinquencyResumeStatus } = useQuery({
    queryKey: [range, 'delinquency-resume'],
    queryFn: async () => fetchResumeDelinquency({
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    })
  })

  const { data: chartDistruibition, status: chartDistruibitionStatus } = useQuery({
    queryKey: [range, 'distruibition-type'],
    queryFn: async () => fetchDistruibitionByType({
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    })
  })


  return {
    range,
    setRange,
    delinquencyResume,
    delinquencyResumeStatus,
    chartDistruibition,
    chartDistruibitionStatus
  }
}