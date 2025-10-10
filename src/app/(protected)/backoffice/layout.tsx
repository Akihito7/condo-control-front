"use client";
import React from "react";
import { ManagementSystemContextProvider } from "./contexts/management-system-context";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ManagementSystemContextProvider>
      <div className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-y-auto">
        {children}
      </div>
    </ManagementSystemContextProvider>
  );
}
