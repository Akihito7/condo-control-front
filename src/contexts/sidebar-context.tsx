"use client";
import React, { createContext, useEffect, useRef, useState } from "react";

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
}
export const SidebarContext = createContext({} as SidebarContextProps);

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        sidebarRef,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
