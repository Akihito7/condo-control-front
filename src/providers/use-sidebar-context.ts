import { SidebarContext } from "@/contexts/sidebar-context";
import { useContext } from "react";

export function useSidebarContext() {
  const data = useContext(SidebarContext);

  if (!data) {
    throw new Error("useSidebar must be used within a sidebarProvider");
  }

  return data
}