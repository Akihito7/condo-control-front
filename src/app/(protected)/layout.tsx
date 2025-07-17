import { Sidebar } from "@/components/sidebar";
import React from "react";
import { QueryProvider } from "@/providers/query-provider";
import { UserContextProvider } from "@/contexts/user-context";
import { SidebarContextProvider } from "@/contexts/sidebar-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarContextProvider>
      <UserContextProvider>
        <QueryProvider>
          <div className="layout-base">
            <Sidebar />
            {children}
          </div>
        </QueryProvider>
      </UserContextProvider>
    </SidebarContextProvider>
  );
}
