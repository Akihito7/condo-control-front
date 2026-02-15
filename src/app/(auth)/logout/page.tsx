"use client";

import { deleteCookies } from "@/actions/cookies";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await deleteCookies("@smartCondo:token");
      router.replace("/signin");
    }

    logout();
  }, []);

  return null;
}
