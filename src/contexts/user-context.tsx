"use client";
import { fetchMe, User } from "@/api/fetch-me";
import React, { createContext, useEffect, useState } from "react";

interface UserContextProps {
  user: User;
}

export const UserContext = createContext({} as UserContextProps);

interface UserContextProviderProps {
  children: React.ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>({} as User);

  async function handleFetchUserAndSetUser() {
    const user = await fetchMe();
    setUser(user);
  }

  useEffect(() => {
    handleFetchUserAndSetUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
