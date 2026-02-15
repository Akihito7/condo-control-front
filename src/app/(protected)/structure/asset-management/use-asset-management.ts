import { deleteAsset } from "@/api/delete-asset";
import { deleteAssetImage } from "@/api/delete-asset-image";
import { fetchAssetCategories } from "@/api/fetch-asset-categories";
import { fetchAssetStatus } from "@/api/fetch-asset-status";
import { Asset, fetchAssets } from "@/api/fetch-assets";
import { fetchCondominiumAreas } from "@/api/fetch-condominium-areas";
import { updateAssetImage } from "@/api/update-asset-image";
import { useUserContext } from "@/providers/use-user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAssetManagement() {
  const [assetSelected, setAssetSelected] = useState<Asset | undefined>();
  const [modalAssetIsOpen, setModalAssetIsOpen] = useState(false);

  const { user } = useUserContext();
  const { condominiumId } = user;

  const queryClient = useQueryClient();

  const { data: categoriesOptions, status: categoriesOptionsStatus } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: fetchAssetCategories,
      enabled: !!condominiumId,
    },
  );

  const { data: areasOptions, status: areasOptionsStatus } = useQuery({
    queryKey: ["asset-management", "areas"],
    queryFn: () => fetchCondominiumAreas(condominiumId),
    enabled: !!condominiumId,
  });

  const { data: statusOptions, status: statusOptionsStatus } = useQuery({
    queryKey: ["asset-management", "status"],
    queryFn: fetchAssetStatus,
    enabled: !!condominiumId,
  });

  const { data: assets, status: statusAssets } = useQuery({
    queryKey: [condominiumId],
    queryFn: async () => fetchAssets({ condominiumId }),
    enabled: !!condominiumId,
  });

  const { mutateAsync: handleDeleteAsset } = useMutation({
    mutationFn: async (assetId: number) => deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [condominiumId],
      });
    },
  });

  const { mutateAsync: handleChangeAssetImage } = useMutation({
    mutationFn: ({ formData, assetId }: any) =>
      updateAssetImage({ assetId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [condominiumId],
      });
    },
  });

  const {
    mutateAsync: handleDeleteAssetImage,
    status: deleteAssetImageStatus,
  } = useMutation({
    mutationFn: (assetId: number) => deleteAssetImage({ assetId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [condominiumId],
      });
    },
  });

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
    handleChangeAssetImage,
    handleDeleteAssetImage,
  };
}
