import { fetchMaintenanceManagementAssets } from "@/api/fetch-maintenance-management-assets";
import { fetchMaintenanceManagementAssetsTypes } from "@/api/fetch-maintenance-management-assets-types";
import { getAsssetMaintenanacesDetails } from "@/api/get-asset-maintenances-details";
import { useUserContext } from "@/providers/use-user-context";
import { useQuery } from "@tanstack/react-query";

export function useAssetsMaintenance() {
  const { user } = useUserContext();

  const { data: assetsTypes, status: assetsTypesStatus } = useQuery({
    queryKey: ["assets-types", user.id],
    queryFn: fetchMaintenanceManagementAssetsTypes,
  });

  const { data: assets, status: assetsStatus } = useQuery({
    queryKey: ["assets", user.id],
    queryFn: fetchMaintenanceManagementAssets,
  });

  const { data: assetDetails, isLoading: assetIsLoading } = useQuery({
    queryKey: ["asset-details"],
    queryFn: getAsssetMaintenanacesDetails,
  });

  return {
    assetsTypes,
    assetsTypesStatus,
    assets,
    assetsStatus,
    assetDetails,
    assetIsLoading,
  };
}
