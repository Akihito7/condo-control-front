"use client";

import { useIsMobile } from "@/lib/use-is-mobile";
import { useSidebarContext } from "@/providers/use-sidebar-context";
import { LayoutPanelLeft } from "lucide-react";
import { useEffect, useRef } from "react";

export function ButtonOpenSidebar() {
  const { setIsOpen, sidebarRef, isOpen } = useSidebarContext();
  const iconSidebar = useRef<SVGSVGElement>(null);
  const isMobile = useIsMobile();
  function handleIsOpen() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        !sidebarRef?.current?.contains(event.target as Node) &&
        !iconSidebar?.current?.contains(event.target as Node) &&
        isOpen &&
        isMobile
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen, sidebarRef, iconSidebar, isMobile]);

  return (
    <LayoutPanelLeft
      ref={iconSidebar}
      className="w-6 h-6 text-gray-700"
      onClick={handleIsOpen}
    />
  );
}
