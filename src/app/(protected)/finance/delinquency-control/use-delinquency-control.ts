"use client";

import { deleteDelinquencyRegister } from "@/api/delete-delinquency-register";
import { fetchCategoriesOptions } from "@/api/fecth-categories-options";
import { fetchApartments } from "@/api/fetch-apartments";
import { fetchDelinquencyMonthlyEvolution } from "@/api/fetch-delinquency-monthly-evolution";
import { fetchDeliquencyRegisters } from "@/api/fetch-delinquency-registers";
import { useUserContext } from "@/providers/use-user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface UseDelinquencyControlProps {
  date: Date;
}
export function useDelinquencyControl({ date }: UseDelinquencyControlProps) {
  const { user } = useUserContext();

  const condominiumId = user.condominiumId;

  const dateFormmated = format(date, "yyyy-MM-dd");

  const queryClient = useQueryClient();

  const { data: categoriesOptions, status: categorioOptionsStatus } = useQuery({
    queryKey: ["delinquency-control", "categoriesOptions"],
    queryFn: fetchCategoriesOptions,
  });

  const { data: apartaments, error: errorApartaments } = useQuery({
    queryKey: ["delinquency-control", "apartments"],
    queryFn: async () => fetchApartments({ condominiumId }),
  });

  const { data: delinequencyRegisters, status: deliquencyRegistersStatus } =
    useQuery({
      queryKey: ["delinquencyRegisters", dateFormmated],
      queryFn: () =>
        fetchDeliquencyRegisters({ condominiumId, date: dateFormmated }),
      enabled: !!condominiumId,
    });

  const { mutateAsync: handeDeleteRegister } = useMutation({
    mutationFn: (delinquencyId: number) =>
      deleteDelinquencyRegister({ delinquencyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delinquencyRegisters"],
        exact: false,
      });
    },
  });

  return {
    categoriesOptions,
    categorioOptionsStatus,
    apartaments,
    errorApartaments,
    delinequencyRegisters,
    deliquencyRegistersStatus,
    handeDeleteRegister,
  };
}
