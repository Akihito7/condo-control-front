import { Sidebar } from "@/components/sidebar";
import React from "react";
import { QueryProvider } from "@/providers/query-provider";
import { api } from "@/services/api";
import { UserContextProvider } from "@/contexts/user-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <UserContextProvider>
      <QueryProvider>
        <div className="layout-base">
          <Sidebar />
          {children}
        </div>
      </QueryProvider>
    </UserContextProvider>
  );
}
