import { Sidebar } from "@/components/sidebar";
import React from "react";
import { QueryProvider } from "@/providers/query-provider";
import { UserContextProvider } from "@/contexts/user-context";
import { SidebarContextProvider } from "@/contexts/sidebar-context";
import { NotificationContextProvider } from "@/contexts/notification-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarContextProvider>
      <UserContextProvider>
        <QueryProvider>
          <NotificationContextProvider>
            <div className="layout-base">
              <Sidebar />
              {children}
            </div>
          </NotificationContextProvider>
        </QueryProvider>
      </UserContextProvider>
    </SidebarContextProvider>
  );
}
