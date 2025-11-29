import { deleteIntervention } from "@/api/delete-intervention";
import { fetchChartImprovementsByArea } from "@/api/fetch-chart-improvements-by-area";
import { fetchChartMonthlyExpensesSummary } from "@/api/fetch-chart-monthly-expenses-summary";
import { fetchCondominiumAreas } from "@/api/fetch-condominium-areas";
import { fetchInterventionCards } from "@/api/fetch-intervention-cards";
import { fetchInterventions } from "@/api/fetch-interventions";
import { fetchMaintenancesStatus } from "@/api/fetch-maintenances-status";
import { fetchMaintenancesTypes } from "@/api/fetch-maintenances-types";
import { fetchPaymentMethodOptions } from "@/api/fetch-payment-method.options";
import { fetchPriorityOptions } from "@/api/fetch-priority-options";
import { fetchResumeIndicatorsMaintenances } from "@/api/fetch-resume-indicators-maintenances";
import { useUserContext } from "@/providers/use-user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from 'date-fns'


interface UseMaintenanceBacklogProps {
  year: string;
}

export function useMaintenanceBacklog({
  year,
}: UseMaintenanceBacklogProps) {
  const {
    user
  } = useUserContext();
  const { condominiumId } = user;

  const queryClient = useQueryClient();

  const currentDate = new Date();
  const [_, ...rest] = currentDate.toISOString().split('T')[0].split('-')

  const dateFormatted = format(`${year}-${rest[0]}-${rest[1]}` as any, 'yyyy-MM-dd')

  const { data: priorityOptions, status: priorityOptionsStatus } = useQuery({
    queryKey: ['priority-options'],
    queryFn: fetchPriorityOptions
  })

  const { data: areasOptions, status: areasOptionsStatus } = useQuery({
    queryKey: ['areas-options'],
    queryFn: async () => fetchCondominiumAreas(condominiumId)
  })

  const STATUS_NOT_ALLOWED = [7,6]
  const { data: paymentMethodsOptions, status: paymentMethodsOptionsStatus } = useQuery({
    queryKey: ['payment-methods-options'],
    queryFn: async () => fetchPaymentMethodOptions(),
    enabled: !!condominiumId
  })

  const { data: maintenancesStatusOptions, status: maintenancesStatusOptionsStatus } = useQuery({
    queryKey: ['status-options'],
    queryFn: fetchMaintenancesStatus,
    enabled: !!condominiumId
  })


  const { data: maintenancesTypes, status: maintenancesTypesStatus } = useQuery({
    queryKey: ['types'],
    queryFn: fetchMaintenancesTypes,
    enabled: !!condominiumId
  })

  const { data: interventions, status: interventionsStatus } = useQuery({
    queryKey: ['interventions', dateFormatted],
    queryFn: async () => fetchInterventions({ date: dateFormatted })
  })

  const { data: interventionsCards, status: interventionsCardsStatus } = useQuery({
    queryKey: ['interventionsCards', dateFormatted],
    queryFn: async () => fetchInterventionCards({ date: dateFormatted })
  })

  const { mutateAsync: handleDeleteIntervention } = useMutation({
    mutationFn: async (interventionId: number) => deleteIntervention(interventionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['interventions', dateFormatted],
      })
      queryClient.invalidateQueries({
        queryKey: ['interventionsCards', dateFormatted],
      })
    }
  })

  const { data: resumeIndicators, status: resumeIndicatorsStatus } = useQuery({
    queryKey: ['chart', 'resume-indicators', year],
    queryFn: () => fetchResumeIndicatorsMaintenances(dateFormatted)

  })

  const { data: chartImprovementsByArea } = useQuery({
    queryKey: ['chart','improvements-by-area', dateFormatted],
    queryFn: () => fetchChartImprovementsByArea(dateFormatted)
  })


  const { data: chartMonthlyExpensesSummary } = useQuery({
    queryKey: ['chart', 'monthly-expenses-summary', dateFormatted],
    queryFn: () => fetchChartMonthlyExpensesSummary(dateFormatted)
  })

  return {
    priorityOptions,
    priorityOptionsStatus,
    areasOptions,
    areasOptionsStatus,
    paymentMethodsOptions,
    paymentMethodsOptionsStatus,
    maintenancesStatusOptions : maintenancesStatusOptions?.filter(status => !STATUS_NOT_ALLOWED.includes(status.id)),
    maintenancesStatusOptionsStatus,
    maintenancesTypes,
    maintenancesTypesStatus,
    interventions,
    interventionsStatus,
    handleDeleteIntervention,
    interventionsCards,
    interventionsCardsStatus,
    resumeIndicators,
    resumeIndicatorsStatus,
    chartImprovementsByArea,
    chartMonthlyExpensesSummary
  }
}