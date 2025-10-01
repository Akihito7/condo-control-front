import { fetchManagementSpacesIndicatorsCards } from "@/api/fetch-management-spaces-indicators-cards";
import { fetchManagementSpacesPercentageByArea } from "@/api/fetch-management-spaces-percentage-by-area";
import { fetchSpacesAreasBookingsChart } from "@/api/fetch-spaces-areas-bookings-chart";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function useIndicators(date: Date) {
  const dateFormatted = format(date, 'yyyy-MM-dd');

  const { data: indicatorsCards, status: indicatorsStatus } = useQuery({
    queryKey: ['indicators-cards', dateFormatted],
    queryFn: () => fetchManagementSpacesIndicatorsCards(dateFormatted),
    enabled: !!dateFormatted
  });

  const { data: bookingsChart, status: bookingsChartStatus } = useQuery({
    queryKey: ['bookings-chart', dateFormatted],
    queryFn: () => fetchSpacesAreasBookingsChart(dateFormatted),
    enabled: !!dateFormatted
  });

  const { data: percentageByAreaChart, status: percentageByAreaChartStatus } = useQuery({
    queryKey: ['percentage-by-area-chart', dateFormatted],
    queryFn: () => fetchManagementSpacesPercentageByArea(dateFormatted),
    enabled: !!dateFormatted
  });

  return {
    indicatorsCards,
    indicatorsStatus,
    bookingsChart,
    bookingsChartStatus,
    percentageByAreaChart,
    percentageByAreaChartStatus
  }
} 