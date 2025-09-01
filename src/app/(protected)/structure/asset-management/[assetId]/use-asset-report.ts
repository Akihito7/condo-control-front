import { fetchAssetsWithReports } from "@/api/fetch-assets-with-reports";
import { useQuery } from "@tanstack/react-query";

export function useAssetReport(assetId: string) {
  const { data: assetsWithReports, status } = useQuery({
    queryKey: ['assets', assetId],
    queryFn: () => fetchAssetsWithReports(assetId)
  });

  return {
    assetsWithReports,
    status
  }
}