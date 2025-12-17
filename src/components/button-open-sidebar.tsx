"use client";

import { useSidebarContext } from "@/providers/use-sidebar-context";
import { LayoutPanelLeft } from "lucide-react";
import { useEffect, useRef } from "react";

export function ButtonOpenSidebar() {
  const { setIsOpen, sidebarRef, isOpen } = useSidebarContext();
  const iconSidebar = useRef<SVGSVGElement>(null);

  function handleIsOpen() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (
        !sidebarRef?.current?.contains(event.target as Node) &&
        !iconSidebar?.current?.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    });
  }, [isOpen]);

  return (
    <LayoutPanelLeft
      ref={iconSidebar}
      className="w-6 h-6 text-gray-700"
      onClick={handleIsOpen}
    />
  );
}
