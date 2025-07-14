"use client";

import { useIsMobile } from "@/lib/use-is-mobile";
import { useSidebarContext } from "@/providers/use-sidebar-context";
import { ReactNode, useEffect, useState } from "react";

export function WrapperSidebar({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const { isOpen, setIsOpen } = useSidebarContext();

  return (
    <div
      onClick={() => {
        if (isOpen && isMobile) {
          setIsOpen(false);
        }
      }}
      className="flex-1 overflow-x-auto"
    >
      {children}
    </div>
  );
}
