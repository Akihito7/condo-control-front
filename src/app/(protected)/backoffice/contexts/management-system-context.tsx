import {
  Apartament,
  fetchApartaments,
} from "@/api/backoffice/fetch-apartaments";
import {
  Condominium,
  fetchCondominiums,
} from "@/api/backoffice/fetch-condominiums";
import { fetchPages, Page } from "@/api/backoffice/fetch-pages";
import { fetchPlans, Plan } from "@/api/backoffice/fetch-plans";
import { fetchTenants, Tenant } from "@/api/backoffice/fetch-tenants";
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
  plans: Plan[] | undefined;
  statusPlans: Status;
  tenants: Tenant[] | undefined;
  statusTenants: Status;
  pages: Page[] | undefined;
  statusPages: Status;
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

  const { data: plans, status: statusPlans } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const { data: tenants, status: statusTenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
  });

  const { data: pages, status: statusPages } = useQuery({
    queryKey: ["pages"],
    queryFn: fetchPages,
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
        plans,
        statusPlans,
        tenants,
        statusTenants,
        pages,
        statusPages,
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
