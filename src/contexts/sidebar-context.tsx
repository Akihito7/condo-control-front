"use client";
import React, { createContext, Dispatch, useState } from "react";

interface SidebarContextProps {
  isOpen: Boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const SidebarContext = createContext({} as SidebarContextProps);

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
