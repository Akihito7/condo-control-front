"use client";
import { fetchMe, User } from "@/api/fetch-me";
import React, { createContext, useEffect, useState } from "react";

interface UserContextProps {
  user: User;
  userIsLoading: boolean;
}

export const UserContext = createContext({} as UserContextProps);

interface UserContextProviderProps {
  children: React.ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userIsLoading, setUserIsLoading] = useState(true);

  async function handleFetchUserAndSetUser() {
    setUserIsLoading(true);
    const user = await fetchMe();
    setUser(user);
    setUserIsLoading(false);
  }

  useEffect(() => {
    handleFetchUserAndSetUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
