import { UserContext } from "@/contexts/user-context";
import { useContext } from "react";

export function useUserContext() {
  const data = useContext(UserContext);

  if (!data) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return data
}