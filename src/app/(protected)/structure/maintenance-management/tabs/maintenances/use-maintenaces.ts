import { fetchMaintenanceManagementAssets } from "@/api/fetch-maintenance-management-assets"
import { fetchMaintenanceManagementAssetsTypes } from "@/api/fetch-maintenance-management-assets-types"
import { fetchMaintenaces } from "@/api/fetch-maintenances"
import { fetchMaintenancesStatus } from "@/api/fetch-maintenances-status"
import { fetchPriorityOptions } from "@/api/fetch-priority-options"
import { useUserContext } from "@/providers/use-user-context"
import { useQuery } from "@tanstack/react-query"

export function useMaintenances() {

  const { user } = useUserContext()
  const { condominiumId } = user;

  const { data: priorityOptions, status: priorityOptionsStatus } = useQuery({
    queryKey: ['priority-options'],
    queryFn: fetchPriorityOptions
  })


  const { data: maintenancesStatusOptions, status: maintenancesStatusOptionsStatus } = useQuery({
    queryKey: ['status-options'],
    queryFn: fetchMaintenancesStatus,
    enabled: !!condominiumId
  })

  const { data: assets, status: assetsStatus } = useQuery({
    queryKey: ['assets', user.id],
    queryFn: fetchMaintenanceManagementAssets
  });

  const { data: maintenances, status: maintenancesStatus } = useQuery({
    queryKey: ['maintenances', user.id],
    queryFn: fetchMaintenaces
  })

  return {
    priorityOptions,
    priorityOptionsStatus,
    maintenancesStatusOptions,
    maintenancesStatusOptionsStatus,
    assets,
    assetsStatus,
    maintenances,
    maintenancesStatus
  }
}