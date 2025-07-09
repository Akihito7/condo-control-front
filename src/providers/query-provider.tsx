"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [clientQuery] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={clientQuery}>{children}</QueryClientProvider>
  );
}
