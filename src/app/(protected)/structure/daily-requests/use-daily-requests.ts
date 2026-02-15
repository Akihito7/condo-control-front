import { getDailyRequestGravitiesOptions } from "@/api/get-daily-request-gravities-options";
import { getDailyRequestRegisters } from "@/api/get-daily-request-records";
import { getDailyRequestResponsibleOptions } from "@/api/get-daily-request-responsible-options";
import { getDailyRequestStatusOptions } from "@/api/get-daily-request-status-options";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

export function useDailyRequests() {
  const [date, setDate] = useState(new Date());
  const dateFormatted = format(date, "yyyy-MM-dd");
  const [gravityId, setGravityId] = useState<string>("");
  const [responsibleName, setResponsibleName] = useState<string>("");

  const { user } = useUserContext();
  const condominiumId = user.condominiumId;

  const { data: statusOptions } = useQuery({
    queryKey: ["daily-request", "status", "options"],
    queryFn: getDailyRequestStatusOptions,
  });

  const { data: gravitiesOptions } = useQuery({
    queryKey: ["daily-request", "gravities", "options"],
    queryFn: getDailyRequestGravitiesOptions,
  });

  const { data: responsibleOptions } = useQuery({
    queryKey: ["responsible", "options"],
    queryFn: getDailyRequestResponsibleOptions,
  });

  const { data: dailyRequestRegisters, status: dailyRequestRegistersStatus } =
    useQuery({
      queryKey: ["daily", "registers", dateFormatted],
      queryFn: () => getDailyRequestRegisters({ date: dateFormatted }),
    });

  return {
    date,
    setDate,
    statusOptions,
    gravitiesOptions,
    responsibleOptions,
    dailyRequestRegisters,
    dailyRequestRegistersStatus,
    gravityId,
    setGravityId,
    responsibleName,
    setResponsibleName,
  };
}
