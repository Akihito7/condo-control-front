"use client";
import { fetchNotification } from "@/api/fetch-notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useEffect } from "react";

import type { Notification as ApiNotification } from "@/api/fetch-notification";
import { supabase } from "@/providers/supabase-client";
import { useUserContext } from "@/providers/use-user-context";

interface NotificationContextProps {
  notifications: ApiNotification[] | undefined;
}

export const NotificationContext = createContext(
  {} as NotificationContextProps
);

interface NotificationContextProviderProps {
  children: React.ReactNode;
}

export function NotificationContextProvider({
  children,
}: NotificationContextProviderProps) {
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotification(),
  });

  const { user } = useUserContext();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications-to-user-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `to_user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.setQueryData<ApiNotification[]>(
            ["notifications"],
            (old) =>
              old
                ? [{ ...(payload.new as ApiNotification) }, ...old]
                : [{ ...(payload.new as ApiNotification) }]
          );
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, queryClient]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
