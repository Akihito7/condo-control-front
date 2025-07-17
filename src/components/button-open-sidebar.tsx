"use client";

import { useSidebarContext } from "@/providers/use-sidebar-context";
import { LayoutPanelLeft } from "lucide-react";

export function ButtonOpenSidebar() {
  const { setIsOpen } = useSidebarContext();

  function handleIsOpen() {
    setIsOpen((prev) => !prev);
  }
  return (
    <LayoutPanelLeft className="w-6 h-6 text-gray-700" onClick={handleIsOpen} />
  );
}
