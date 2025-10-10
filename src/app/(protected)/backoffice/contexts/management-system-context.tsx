import {
  Apartament,
  fetchApartaments,
} from "@/api/backoffice/fetch-apartaments";
import {
  Condominium,
  fetchCondominiums,
} from "@/api/backoffice/fetch-condominiums";
import { fetchUsers, User } from "@/api/backoffice/fetch-users";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";

type Status = "error" | "success" | "pending";

interface ManagementSystemContextProps {
  users: User[] | undefined;
  statusUsers: Status;
  condominiums: Condominium[] | undefined;
  statusCondominiums: Status;
  apartaments: Apartament[] | undefined;
  apartamentsStatus: Status;
}
const ManagementSystemContext = createContext<ManagementSystemContextProps>(
  {} as ManagementSystemContextProps
);

export function ManagementSystemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: users, status: statusUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: condominiums, status: statusCondominiums } = useQuery({
    queryKey: ["condominiums"],
    queryFn: fetchCondominiums,
  });

  const { data: apartaments, status: apartamentsStatus } = useQuery({
    queryKey: ["apartaments"],
    queryFn: fetchApartaments,
  });

  return (
    <ManagementSystemContext.Provider
      value={{
        users,
        statusUsers,
        condominiums,
        statusCondominiums,
        apartaments,
        apartamentsStatus,
      }}
    >
      {children}
    </ManagementSystemContext.Provider>
  );
}

export function useManagementSystemContext() {
  const data = useContext(ManagementSystemContext);

  if (!data) {
    throw new Error(
      "useManagementSystemContext must be used within a ManagementSystemProvider"
    );
  }

  return data;
}
