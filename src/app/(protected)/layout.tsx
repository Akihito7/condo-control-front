import { Sidebar } from "@/components/sidebar";
import React from "react";
import { QueryProvider } from "@/providers/query-provider";
import { UserContextProvider } from "@/contexts/user-context";
import { SidebarContextProvider } from "@/contexts/sidebar-context";
import { WrapperSidebar } from "@/components/wrapper-sidebar";

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
            <WrapperSidebar>{children}</WrapperSidebar>
          </div>
        </QueryProvider>
      </UserContextProvider>
    </SidebarContextProvider>
  );
}
