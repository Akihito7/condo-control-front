import { fetchEmployees } from "@/api/fetch-employees";
import { fetchOptionsIssuesOpeningCalls } from "@/api/fetch-options-issues-opening-calls";
import { fetchOptionsStatusOpeningCalls } from "@/api/fetch-options-status-opening-calls";
import { getCardsOpeningCalls } from "@/api/get-cards-opening-calls";
import { getOpeningCallsRecords } from "@/api/get-opening-calls-records";
import { useUserContext } from "@/providers/use-user-context";
import { getFullMonthInterval } from "@/utils/get-full-month-interval";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useOpeningCalls() {
  const [date, setDate] = useState(new Date());
  const { startDate, endDate } = getFullMonthInterval(
    format(date, "yyyy-MM-dd"),
  );

  const { user } = useUserContext();
  const { condominiumId } = user;
  /* 
    const startDateFormmated = format(startDate, 'yyyy-MM-dd')
    const endDateFormmated = format(endDate, 'yyyy-MM-dd') */

  const { data: openingRecords, status: openingRecordsStatus } = useQuery({
    queryKey: ["openingCallsRecords", startDate, endDate],
    queryFn: async () =>
      getOpeningCallsRecords({ condominiumId, startDate, endDate }),
    enabled: !!condominiumId && !!startDate && !!endDate,
  });

  const { data: openingCards, status: openingCardsStatus } = useQuery({
    queryKey: ["openingCards", startDate, endDate],
    queryFn: async () =>
      getCardsOpeningCalls({ condominiumId, startDate, endDate }),
    enabled: !!condominiumId && !!startDate && !!endDate,
  });

  const { data: statusOptions, status: optionsStatus } = useQuery({
    queryKey: ["openings-calls", "status"],
    queryFn: fetchOptionsStatusOpeningCalls,
  });

  const { data: issuesOptions, status: optionsIssuesStatus } = useQuery({
    queryKey: ["openings-calls", "issues"],
    queryFn: fetchOptionsIssuesOpeningCalls,
  });

  const { data: employeesOptions, status: employeesOptionsStatus } = useQuery({
    queryKey: ["openings-calls", "employees"],
    queryFn: fetchEmployees,
  });

  return {
    openingRecords,
    openingRecordsStatus,
    openingCards,
    openingCardsStatus,
    statusOptions,
    optionsStatus,
    issuesOptions,
    optionsIssuesStatus,
    employeesOptions,
    employeesOptionsStatus,
    date,
    setDate,
  };
}
