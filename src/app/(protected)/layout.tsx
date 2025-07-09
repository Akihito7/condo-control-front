import { Sidebar } from "@/components/sidebar";
import React from "react";
import { QueryProvider } from "@/providers/query-provider";
import { api } from "@/services/api";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await api.get("auth/me");
  //comecar o context com essas infos;

  return (
    <QueryProvider>
      <div className="layout-base">
        <Sidebar />
        {children}
      </div>
    </QueryProvider>
  );
}
