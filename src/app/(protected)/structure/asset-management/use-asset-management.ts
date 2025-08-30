import { deleteAsset } from "@/api/delete-asset";
import { fetchAssetCategories } from "@/api/fetch-asset-categories";
import { fetchAssetStatus } from "@/api/fetch-asset-status";
import { Asset, fetchAssets } from "@/api/fetch-assets";
import { fetchCondominiumAreas } from "@/api/fetch-condominium-areas";
import { useUserContext } from "@/providers/use-user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAssetManagement() {
  const [assetSelected, setAssetSelected] = useState<Asset | undefined>();
  const [modalAssetIsOpen, setModalAssetIsOpen] = useState(false);

  const {
    user
  } = useUserContext();
  const { condominiumId } = user;

  const queryClient = useQueryClient();

  const { data: categoriesOptions, status: categoriesOptionsStatus } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAssetCategories
  });

  const { data: areasOptions, status: areasOptionsStatus } = useQuery({
    queryKey: ['areas'],
    queryFn: () => fetchCondominiumAreas(condominiumId),
    enabled: !!condominiumId
  })

  const { data: statusOptions, status: statusOptionsStatus } = useQuery({
    queryKey: ['status'],
    queryFn: fetchAssetStatus,
    enabled: !!condominiumId
  })

  const { data: assets, status: statusAssets } = useQuery({
    queryKey: [condominiumId],
    queryFn: async () => fetchAssets({ condominiumId }),
    enabled: !!condominiumId
  })

  const { mutateAsync: handleDeleteAsset } = useMutation({
    mutationFn: async (assetId: number) => deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [condominiumId]
      })
    }
  })

  return {
    assetSelected,
    setAssetSelected,
    modalAssetIsOpen,
    setModalAssetIsOpen,
    categoriesOptions,
    categoriesOptionsStatus,
    areasOptions,
    areasOptionsStatus,
    statusOptionsStatus,
    statusOptions,
    assets,
    statusAssets,
    handleDeleteAsset,
  }
}